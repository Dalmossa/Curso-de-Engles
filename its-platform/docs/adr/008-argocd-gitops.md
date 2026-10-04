---
adr: 008
title: ArgoCD for GitOps deployments
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @sre-lead]
deciders: [@platform-lead, @sre-lead, @backend-lead]
consulted: [@security-lead]
informed: [@team]
tags: [gitops, argocd, kubernetes, deployment]
---

## Context

The ITS Platform needs a deployment strategy for Kubernetes that provides:

- **Declarative** — desired state in Git, cluster converges automatically
- **Audit trail** — every change tracked in Git history
- **Rollback** — `git revert` = instant rollback
- **Drift detection** — alert when cluster diverges from Git
- **Multi-environment** — dev, staging, prod from same manifests
- **Progressive delivery** — canary, blue-green via Argo Rollouts (future)

Alternatives: ArgoCD, Flux v2, Spinnaker, Jenkins + Helm, manual `kubectl apply`.

## Decision

**Use ArgoCD 2.9+ for GitOps continuous deployment.**

### Why ArgoCD?

| Requirement | ArgoCD | Flux v2 | Spinnaker | Jenkins |
|---|---|---|---|---|
| Declarative (Git → Cluster) | ✅ | ✅ | ❌ | ❌ |
| Drift detection + auto-heal | ✅ | ✅ | ❌ | ❌ |
| Multi-cluster | ✅ | ✅ | ✅ | ❌ |
| UI + RBAC | ✅ Excellent | Basic | ✅ | ❌ |
| Helm/Kustomize native | ✅ | ✅ | ❌ | Manual |
| Progressive delivery | ✅ Argo Rollouts | ✅ Flagger | ✅ | Manual |
| Team familiarity | High | Medium | Low | High |

### Project Structure

```yaml
# iac/argocd/projects/its-platform.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: its-platform
  namespace: argocd
spec:
  description: ITS Platform microservices
  sourceRepos:
    - "https://github.com/its-platform/its-platform.git"
  destinations:
    - namespace: its-platform-dev
      server: https://kubernetes.default.svc
    - namespace: its-platform-staging
      server: https://kubernetes.default.svc
    - namespace: its-platform-prod
      server: https://kubernetes.default.svc
  clusterResourceWhitelist:
    - group: ""
      kind: Namespace
  namespaceResourceWhitelist:
    - group: ""
      kind: "*"
  roles:
    - name: developer
      description: Read-only access to dev
      policies:
        - p, proj:its-platform:developer, applications, get, its-platform/*, allow
    - name: sre
      description: Full access to all environments
      policies:
        - p, proj:its-platform:sre, applications, *, its-platform/*, allow
```

### Applications

```yaml
# iac/argocd/applications/its-platform-dev.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: its-platform-dev
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: its-platform
  source:
    repoURL: https://github.com/its-platform/its-platform.git
    targetRevision: main
    path: iac/helm/its-platform
    helm:
      valueFiles:
        - values.yaml
        - values-dev.yaml
      parameters:
        - name: global.environment
          value: "dev"
  destination:
    server: https://kubernetes.default.svc
    namespace: its-platform-dev
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
  ignoreDifferences:
    - group: apps
      kind: Deployment
      jsonPointers:
        - /spec/replicas  # HPA manages replicas
```

### Environment Promotion

```
main branch
    │
    ▼
┌─────────────┐
│   dev       │  Auto-sync on push to main
│ (its-platform-dev)    │
└─────────────┘
    │
    ▼ (PR to promotion branch or manual)
┌─────────────┐
│   staging   │  Auto-sync on tag `staging-*`
│ (its-platform-staging)│
└─────────────┘
    │
    ▼ (Manual approval in ArgoCD UI)
┌─────────────┐
│   prod      │  Manual sync on tag `v*`
│ (its-platform-prod)   │
└─────────────┘
```

```yaml
# iac/argocd/applications/its-platform-prod.yaml
spec:
  source:
    targetRevision: "v*"  # Only tags matching v*
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
      allowEmpty: false
    # NO automated.sync — manual approval required
```

## Consequences

### Positive
- **Single source of truth** — Git = desired state
- **Instant rollback** — `git revert` → ArgoCD syncs previous version
- **Drift detection** — UI shows `OutOfSync`; `selfHeal` corrects automatically
- **Audit trail** — every deploy = Git commit + ArgoCD history
- **Multi-env from one chart** — Helm values files per environment
- **Progressive delivery ready** — Argo Rollouts integration for canary

### Negative
- **Learning curve** — ArgoCD concepts (AppProject, Application, SyncWave)
- **Bootstrap chicken-egg** — ArgoCD must be installed before it can manage itself
- **Secret management** — SealedSecrets or External Secrets Operator needed
- **Resource overhead** — ArgoCD controller + repo-server + dex

### Neutral
- **RBAC** — Dex/OIDC integration for SSO; project-level roles
- **Notifications** — Slack/email on sync status via ArgoCD Notifications

## Alternatives Considered

1. **Flux v2** — Excellent, but ArgoCD UI is superior for team visibility; Flux better for pure GitOps purists
2. **Spinnaker** — Overkill; pipeline-based not declarative; heavy
3. **Jenkins + Helm** — Imperative; no drift detection; manual rollback
4. **Manual `kubectl apply`** — No audit, no drift detection, no rollback

## Implementation Plan

- [x] Install ArgoCD via Helm in `argocd` namespace
- [x] Configure Dex for GitHub OAuth SSO
- [x] Create `AppProject` `its-platform`
- [x] Create `Application` for dev (auto-sync)
- [x] Create `Application` for staging (auto-sync on tag)
- [x] Create `Application` for prod (manual sync)
- [x] Configure `ignoreDifferences` for HPA-managed replicas
- [ ] Add SealedSecrets controller for secret management
- [ ] Add ArgoCD Notifications (Slack on sync success/failure)
- [ ] Add Argo Rollouts for canary deployments (future)
- [ ] Disaster recovery: `argocd admin export` backup schedule

## References

- `iac-spec.md` §6 — GitOps workflow
- `runbook.md` §2.1 — Deploy procedure
- ArgoCD docs: https://argo-cd.readthedocs.io
- Argo Rollouts: https://argoproj.github.io/argo-rollouts