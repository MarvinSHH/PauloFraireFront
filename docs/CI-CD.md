# CI/CD Frontend (alineado al backend)

Este documento describe el pipeline de CI/CD del frontend siguiendo el estilo del backend, sin modificar el backend.

## Justificación del flujo de trabajo
- Integración continua asegura calidad: validación de entorno, lint, build y pruebas en cada `push`/PR.
- Entrega continua automatiza despliegue en Render tras pasar CI, con verificación de salud post-deploy.
- Paridad con backend: scripts dedicados para entorno, pruebas y health-check.

## Entorno requerido
- Node `18.x` en CI.
- Variables de entorno en CI:
  - `VITE_BACKEND_URL` (obligatorio).
  - `VITE_METRICS_ENDPOINT` (opcional).
- En Render (Static Site):
  - `Root Directory`: `PauloFraireFront`
  - `Build Command`: `npm ci && npm run build`
  - `Publish Directory`: `dist`
  - Variables: `VITE_BACKEND_URL`, `NODE_VERSION=18`, `VITE_METRICS_ENDPOINT` (opcional).

## Niveles de servicio acordados
- Pipeline: éxito de lint, build y pruebas < 10 min (medido en Actions).
- Despliegue: inicio automático tras CI, verificación de salud < 5 min.
- Disponibilidad de frontend: monitorizado mediante health-check y métricas Web Vitals.

## Métricas de monitoreo
- Web Vitals: CLS, FID, LCP, FCP, TTFB via `src/monitoring/webVitals.js` (si `VITE_METRICS_ENDPOINT`).
- Estado del pipeline: estados de jobs Actions y duración.
- Health-check post-deploy: respuesta HTTP 200 y contenido no vacío.

## Parámetros de configuración de herramientas
- GitHub Actions secrets:
  - `VITE_BACKEND_URL` (requerido).
  - `VITE_METRICS_ENDPOINT` (opcional).
  - `RENDER_DEPLOY_HOOK_URL_FRONTEND` (recomendado) o `RENDER_API_KEY` + `RENDER_SERVICE_ID_FRONTEND`.
  - `FRONTEND_PUBLIC_URL` para health-check del ambiente liberado.

## Herramienta de CI configurada y vinculada al despliegue
- GitHub Actions (`.github/workflows/frontend-ci.yml`): CI/CD completo.
- Despliegue a Render:
  - Vía Deploy Hook (preferente) o API.
  - Health-check del sitio publicado (`scripts/release-health-check.js`).

## Scripts del flujo de trabajo
- `scripts/validate-environment.js`: valida variables y versión Node.
- `scripts/setup-environment.js`: genera `.env.production` para build.
- `scripts/integration-tests.js`: ejecuta Vitest en CI.
- `scripts/smoke-release.js`: smoke test del build con `vite preview`.
- `scripts/release-health-check.js`: poll del URL desplegado (Render).

## Ejecución en CI
- Ver `PauloFraireFront/.github/workflows/frontend-ci.yml`:
  - CI: checkout → node → npm ci → validate → lint → build → tests → env setup → smoke.
  - Deploy: hook/API → health-check (usando `FRONTEND_PUBLIC_URL`).