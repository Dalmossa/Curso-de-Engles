---
name: Observability Stack
description: Prometheus, Grafana, Loki, Tempo, Alertmanager, SLOs for ITS Platform
---

# Observability Stack Skill — ITS Platform

## When to Use
- Setting up monitoring stack (LGTM: Loki, Grafana, Tempo, Prometheus)
- Defining SLOs and alerting rules
- Creating dashboards
- Configuring distributed tracing
- Log aggregation and querying

## Stack Components

| Component | Version | Purpose |
|-----------|---------|---------|
| Prometheus | 2.47+ | Metrics collection & alerting |
| Grafana | 10.2+ | Dashboards & visualization |
| Loki | 2.9+ | Log aggregation |
| Tempo | 2.4+ | Distributed tracing |
| Alertmanager | 0.26+ | Alert routing & deduplication |
| OpenTelemetry | 1.21+ | Instrumentation & collection |

## Architecture

```
Services (FastAPI) → OpenTelemetry SDK → OTel Collector
                                                      │
                    ┌─────────────────────────────────┼─────────────────────────────────┐
                    ▼                                 ▼                                 ▼
              Prometheus (metrics)              Loki (logs)                        Tempo (traces)
                    │                                 │                                 │
                    ▼                                 ▼                                 ▼
              Alertmanager                      Grafana (dashboards)              Grafana (traces)
```

## Prometheus Configuration

```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 30s
  evaluation_interval: 30s

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/rules/*.yml'

scrape_configs:
  - job_name: 'kubernetes-apiservers'
    kubernetes_sd_configs:
      - role: endpoints
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - source_labels: [__meta_kubernetes_namespace, __meta_kubernetes_service_name, __meta_kubernetes_endpoint_port_name]
        action: keep
        regex: default;kubernetes;https

  - job_name: 'kubernetes-nodes'
    kubernetes_sd_configs:
      - role: node
    scheme: https
    tls_config:
      ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
    bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
    relabel_configs:
      - action: labelmap
        regex: __meta_kubernetes_node_label_(.+)

  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

  - job_name: 'its-platform-services'
    kubernetes_sd_configs:
      - role: pod
        namespaces:
          names:
            - its-platform-dev
            - its-platform-staging
            - its-platform-prod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__
      - action: labelmap
        regex: __meta_kubernetes_pod_label_(.+)
      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: namespace
      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: pod
```

## Alerting Rules

```yaml
# prometheus/rules/its-platform-critical.yml
groups:
- name: its-platform-critical
  rules:
  - alert: ServiceDown
    expr: up{job="its-platform-services"} == 0
    for: 2m
    labels:
      severity: P1
    annotations:
      summary: "{{ $labels.job }} is down"
      runbook: "https://wiki.its.example.com/runbook#p1-service-down"

  - alert: HighErrorRate
    expr: |
      sum(rate(http_requests_total{status=~"5.."}[5m])) by (service)
      /
      sum(rate(http_requests_total[5m])) by (service)
      > 0.05
    for: 5m
    labels:
      severity: P1
    annotations:
      summary: "High error rate on {{ $labels.service }}"
      runbook: "https://wiki.its.example.com/runbook#p1-service-down"

  - alert: HighLatencyP95
    expr: |
      histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))
      > 0.5
    for: 10m
    labels:
      severity: P2
    annotations:
      summary: "High p95 latency on {{ $labels.service }}"
      runbook: "https://wiki.its.example.com/runbook#p2-high-latency"

  - alert: DatabaseConnectionsHigh
    expr: |
      pg_stat_activity_count{state="active"} / pg_settings_max_connections > 0.8
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "Database connections > 80%"
      runbook: "https://wiki.its.example.com/runbook#p2-database-issues"

  - alert: ReplicationLagHigh
    expr: |
      pg_replication_lag_seconds > 30
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "PostgreSQL replication lag > 30s"
      runbook: "https://wiki.its.example.com/runbook#p2-database-issues"

  - alert: CeleryQueueBacklog
    expr: |
      celery_queue_length > 1000
    for: 10m
    labels:
      severity: P2
    annotations:
      summary: "Celery queue {{ $labels.queue }} backlog > 1000"
      runbook: "https://wiki.its.example.com/runbook#p2-celery-backlog"

  - alert: FailedLoginsSpike
    expr: |
      rate(auth_failed_logins_total[5m]) > 10
    for: 5m
    labels:
      severity: P2
    annotations:
      summary: "Failed login spike detected"
      runbook: "https://wiki.its.example.com/runbook#p2-security"

  - alert: CertificateExpiring
    expr: |
      ssl_certificate_expiry_days < 30
    for: 1h
    labels:
      severity: P3
    annotations:
      summary: "TLS certificate expires in {{ $value }} days"
      runbook: "https://wiki.its.example.com/runbook#p3-cert-renewal"
```

## Grafana Dashboards

```json
{
  "dashboard": {
    "title": "ITS Platform - Overview",
    "tags": ["its-platform", "overview"],
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m])) by (service) / sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Latency p95",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, service))",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Active Learners",
        "type": "stat",
        "targets": [
          {
            "expr": "count(count by (learner_id) (http_requests_total))",
            "legendFormat": "Active Learners"
          }
        ]
      }
    ]
  }
}
```

## SLO Definitions

```yaml
# slo/its-platform-slos.yml
slos:
  - name: "API Availability"
    service: "api-gateway"
    indicator: "availability"
    target: 99.9%
    window: "30d"
    error_budget_policy:
      - alert: "burn_rate_2x"
        threshold: 2
      - alert: "burn_rate_10x"
        threshold: 10

  - name: "API Latency p95"
    service: "api-gateway"
    indicator: "latency_p95"
    target: "< 200ms"
    window: "30d"

  - name: "Practice Submission Success"
    service: "adaptive-engine"
    indicator: "success_rate"
    target: 99.9%
    window: "30d"

  - name: "Diagnostic Placement Accuracy"
    service: "diagnostic-service"
    indicator: "placement_correlation"
    target: "r >= 0.7"
    window: "90d"

  - name: "Audio Delivery Success"
    service: "listening-service"
    indicator: "delivery_success_rate"
    target: 99.5%
    window: "30d"
```

## OpenTelemetry Instrumentation

```python
# its_platform/telemetry.py
from opentelemetry import trace, metrics
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor

def setup_telemetry(service_name: str):
    # Traces
    trace_provider = TracerProvider()
    trace_provider.add_span_processor(
        BatchSpanProcessor(OTLPSpanExporter(endpoint="http://tempo:4317"))
    )
    trace.set_tracer_provider(trace_provider)

    # Metrics
    metric_reader = PeriodicExportingMetricReader(
        OTLPMetricExporter(endpoint="http://tempo:4317")
    )
    metrics.set_meter_provider(MeterProvider(metric_readers=[metric_reader]))

    # Auto-instrumentation
    FastAPIInstrumentor.instrument()
    SQLAlchemyInstrumentor.instrument(engine=engine)
    RedisInstrumentor.instrument()
    HTTPXClientInstrumentor.instrument()

    return trace.get_tracer(__name__)
```

## Validation Checklist
- [ ] Prometheus scrapes all services (k8s service discovery)
- [ ] Alert rules cover P1-P4 with runbook links
- [ ] Grafana dashboards for all key services
- [ ] SLOs defined with error budget policies
- [ ] OpenTelemetry auto-instrumentation for FastAPI, SQLAlchemy, Redis, HTTPX
- [ ] Loki receives structured JSON logs with labels
- [ ] Tempo receives traces with correlation-id
- [ ] Alertmanager routes P1-P4 with correct escalation
- [ ] Dashboards load in < 5s