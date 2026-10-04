---
adr: 007
title: Istio mTLS for service mesh
status: Accepted
date: 2026-10-03
authors: [@platform-lead, @sre-lead]
deciders: [@platform-lead, @sre-lead, @security-lead]
consulted: [@backend-lead]
informed: [@team]
tags: [service-mesh, istio, mtls, zero-trust]
---

## Context

The ITS Platform runs ~10 microservices in Kubernetes. Security requirements:

- **Encryption in transit** — all service-to-service traffic encrypted
- **Service identity** — workload identity via SPIFFE/SPIRE
- **Authorization** — L7 policies (which service can call which)
- **Observability** — distributed tracing, metrics, access logs
- **Zero-trust** — no implicit trust between services

Alternatives: Istio, Linkerd, Consul Connect, AWS App Mesh, Cilium.

## Decision

**Use Istio 1.20+ with ambient mesh (sidecarless) for mTLS and L7 authorization.**

### Why Istio?

| Requirement | Istio | Linkerd | Consul | App Mesh | Cilium |
|---|---|---|---|---|---|
| mTLS | ✅ Ambient/Sidecar | ✅ Sidecar | ✅ | ✅ | ✅ |
| L7 AuthZ (HTTP) | ✅ AuthorizationPolicy | ✅ ServerAuthz | ✅ | ✅ | ✅ CiliumNetworkPolicy |
| Distributed tracing | ✅ Envoy + OpenTelemetry | ✅ | ✅ | ✅ | ✅ |
| Metrics | ✅ Prometheus + Envoy | ✅ | ✅ | ✅ | ✅ |
| Ambient mode (no sidecar) | ✅ 1.22+ | ❌ | ❌ | ❌ | ✅ |
| Kubernetes native | ✅ CRDs | ✅ CRDs | ✅ | ✅ CRDs | ✅ CNI |
| Team expertise | Medium | Low | Low | Low | Medium |

**Ambient mode** chosen to avoid sidecar resource overhead (~100MB per pod).

### Configuration

```yaml
# istio/peerauthentication.yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: its-platform
spec:
  mtls:
    mode: STRICT

---
# istio/authorization-policies.yaml
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: curriculum-service-authz
  namespace: its-platform
spec:
  selector:
    matchLabels:
      app: curriculum-service
  rules:
    - from:
        - source:
            principals:
              - "cluster.local/ns/its-platform/sa/api-gateway"
              - "cluster.local/ns/its-platform/sa/adaptive-engine"
              - "cluster.local/ns/its-platform/sa/diagnostic-service"
    - to:
        - operation:
            methods: ["GET"]
            paths: ["/v1/curriculum/*"]

---
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: adaptive-engine-authz
  namespace: its-platform
spec:
  selector:
    matchLabels:
      app: adaptive-engine
  rules:
    - from:
        - source:
            principals:
              - "cluster.local/ns/its-platform/sa/api-gateway"
              - "cluster.local/ns/its-platform/sa/celery-worker"
    - to:
        - operation:
            methods: ["POST"]
            paths: ["/v1/adaptive/*"]

---
# Default deny-all for unmatched
apiVersion: security.istio.io/v1beta1
kind: AuthorizationPolicy
metadata:
  name: deny-all
  namespace: its-platform
spec:
  selector: {}
  rules: []
```

### Ambient Mode Setup

```bash
# Install Istio with ambient profile
istioctl install --set profile=ambient -y

# Enable ambient for namespace
kubectl label namespace its-platform istio.io/dataplane-mode=ambient

# Verify
istioctl x ambient describe pod -n its-platform
```

### Workload Identity

```yaml
# ServiceAccounts get SPIFFE IDs automatically
# cluster.local/ns/its-platform/sa/curriculum-service
# Used in AuthorizationPolicy principals
```

## Consequences

### Positive
- **Zero-trust by default** — STRICT mTLS, deny-all AuthorizationPolicy
- **No sidecars** — ambient mode saves ~1GB RAM across cluster
- **L7 authorization** — HTTP path/method/headers in AuthorizationPolicy
- **Observability** — Envoy access logs → Loki, metrics → Prometheus, traces → Tempo
- **Certificate rotation** — automatic (24h default), no manual intervention

### Negative
- **Complexity** — Istio CRDs, ambient architecture, CNI
- **Resource overhead** — ztunnel per node (~50MB), waypoint proxies per namespace
- **Debugging** — mTLS errors can be opaque; need `istioctl x authz check`
- **Upgrade risk** — Istio upgrades require careful planning

### Neutral
- **CNI** — Istio CNI required for ambient; replaces default CNI
- **Waypoint proxies** — L7 enforcement per namespace; scale separately

## Alternatives Considered

1. **Linkerd** — Simpler, but no ambient mode (sidecars required), no L7 HTTP authz
2. **Cilium** — eBPF-based, great performance, but team less familiar; L7 via CiliumNetworkPolicy
3. **Consul Connect** — Requires Consul cluster; extra operational burden
4. **AWS App Mesh** — Vendor lock-in; Envoy sidecars only
5. **No mesh (plain mTLS via cert-manager)** — No L7 authz, no centralized policy, manual cert rotation

## Implementation Plan

- [x] Install Istio ambient profile: `istioctl install --set profile=ambient`
- [x] Label namespace: `istio.io/dataplane-mode=ambient`
- [x] Create `PeerAuthentication` STRICT
- [x] Create `AuthorizationPolicy` per service (allow-list)
- [x] Create default `deny-all` policy
- [x] Configure telemetry: `Telemetry` CRD for Prometheus metrics, access logs
- [ ] Add `RequestAuthentication` for JWT validation at mesh level (defense in depth)
- [ ] Configure `EnvoyFilter` for custom headers (correlation-id propagation)
- [ ] Load test: mTLS overhead < 2ms p99
- [ ] Document `istioctl x authz check` debugging workflow

## Consequences for Services

- **Services don't handle mTLS** — ztunnel/waypoint handles it
- **Services see plain HTTP** — no cert loading, no TLS config in app
- **Services must trust `X-Forwarded-Client-Cert`** — for learner identity if needed
- **Kong Ingress Controller** — runs outside mesh; communicates via waypoint

## References

- `security-spec.md` §5 — Network security
- `threat-model.md` §3.1 — Spoofing S-05, S-06
- `iac-spec.md` §7 — DR networking
- Istio ambient docs: https://istio.io/latest/docs/setup/getting-started/#ambient
- AuthorizationPolicy: https://istio.io/latest/docs/reference/config/security/authorization_policy/