---
name: Kubernetes Helm
description: Helm charts, K8s manifests, ArgoCD integration, HPA, NetworkPolicies for ITS Platform
---

# Kubernetes Helm Skill — ITS Platform

## When to Use
- Creating/updating Helm charts for microservices
- Configuring K8s manifests (Deployment, Service, Ingress, ConfigMap, Secret)
- Setting up HPA, VPA, PodDisruptionBudgets
- NetworkPolicies and Istio integration
- ArgoCD Application definitions

## Helm Chart Structure

```
its-platform/helm/its-platform/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
├── values-staging.yaml
├── values-prod.yaml
├── templates/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   ├── hpa.yaml
│   ├── servicemonitor.yaml
│   ├── pdb.yaml
│   ├── networkpolicy.yaml
│   └── _helpers.tpl
└── charts/
    ├── postgresql-12.1.0.tgz
    ├── redis-17.0.0.tgz
    └── kong-2.20.0.tgz
```

## Key Templates

### Deployment
```yaml
# templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
  labels: {{- include "its-platform.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels: {{- include "its-platform.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels: {{- include "its-platform.selectorLabels" . | nindent 8 }}
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "{{ .Values.service.port }}"
        prometheus.io/path: "/metrics"
    spec:
      serviceAccountName: {{ .Release.Name }}-sa
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        fsGroup: 1000
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.registry }}/{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports:
            - name: http
              containerPort: {{ .Values.service.port }}
              protocol: TCP
          envFrom:
            - configMapRef:
                name: {{ .Release.Name }}-config
            - secretRef:
                name: {{ .Release.Name }}-secrets
          resources:
            {{- toYaml .Values.resources | nindent 12 }}
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            initialDelaySeconds: 5
            periodSeconds: 10
```

### HPA (Horizontal Pod Autoscaler)
```yaml
# templates/hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {{ .Release.Name }}-{{ .Chart.Name }}
  minReplicas: {{ .Values.autoscaling.minReplicas }}
  maxReplicas: {{ .Values.autoscaling.maxReplicas }}
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: {{ .Values.autoscaling.targetCPUUtilizationPercentage }}
  - type: External
    external:
      metric:
        name: celery_queue_length
        selector:
          matchLabels:
            queue: priority
      target:
        type: AverageValue
        averageValue: "100"
  behavior:
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
      - type: Percent
        value: 100
        periodSeconds: 60
    scaleDown:
      stabilizationWindowSeconds: 300
```

### NetworkPolicy
```yaml
# templates/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
spec:
  podSelector:
    matchLabels: {{- include "its-platform.selectorLabels" . | nindent 4 }}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
        - podSelector:
            matchLabels:
              app: kong
      ports:
        - protocol: TCP
          port: 8000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgresql
      ports:
        - protocol: TCP
          port: 5432
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - protocol: TCP
          port: 6379
    - to:
        - namespaceSelector:
            matchLabels:
              name: kube-system
      ports:
        - protocol: TCP
          port: 53
        - protocol: UDP
          port: 53
```

### ServiceMonitor (Prometheus)
```yaml
# templates/servicemonitor.yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: {{ .Release.Name }}-{{ .Chart.Name }}
  labels:
    release: prometheus
spec:
  selector:
    matchLabels: {{- include "its-platform.selectorLabels" . | nindent 4 }}
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
```

## Values Files

### values.yaml (Base)
```yaml
# values.yaml
replicaCount: 3
image:
  registry: ghcr.io
  repository: its-platform/api
  tag: latest
  pullPolicy: IfNotPresent
  pullSecrets:
    - name: regcred

service:
  type: ClusterIP
  port: 8000

resources:
  limits:
    cpu: 1000m
    memory: 1Gi
  requests:
    cpu: 250m
    memory: 512Mi

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  - name: DATABASE_URL
    valueFrom:
      secretKeyRef:
        name: its-platform-secrets
        key: database-url
  - name: REDIS_URL
    valueFrom:
      secretKeyRef:
        name: its-platform-secrets
        key: redis-url
  - name: JWT_PUBLIC_KEY
    valueFrom:
      secretKeyRef:
        name: its-platform-secrets
        key: jwt-public-key

livenessProbe:
  httpGet:
    path: /healthz
    port: 8000
  initialDelaySeconds: 10
  periodSeconds: 30

readinessProbe:
  httpGet:
    path: /ready
    port: 8000
  initialDelaySeconds: 5
  periodSeconds: 10

nodeSelector: {}
tolerations: []
affinity: {}
```

### values-prod.yaml
```yaml
# values-prod.yaml
replicaCount: 5

image:
  tag: "v1.2.3"

resources:
  limits:
    cpu: 2000m
    memory: 2Gi
  requests:
    cpu: 500m
    memory: 1Gi

autoscaling:
  maxReplicas: 20
  targetCPUUtilizationPercentage: 60

nodeSelector:
  workload-type: general

tolerations:
  - key: "workload-type"
    operator: "Equal"
    value: "general"
    effect: "NoSchedule"
```

## Validation Checklist
- [ ] Helm chart passes `helm lint`
- [ ] Templates render correctly for all environments
- [ ] HPA configured with custom metrics (queue depth)
- [ ] NetworkPolicies restrict traffic (default deny)
- [ ] ServiceMonitor for Prometheus scraping
- [ ] PDB for high availability
- [ ] Security context: non-root, read-only rootfs
- [ ] Resource limits/requests set appropriately
- [ ] Values files for dev/staging/prod