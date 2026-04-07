# Nyro ROaaS - Revelop Operations as a Service

<div align="center">

**Sistema de Control de Caja y Operaciones para Micro-Retail**

*Perú y Latinoamérica*

</div>

---

## Tabla de Contenidos

0. [Estado Actual Verificado](#estado-actual-verificado-2026-03-21)
1. [Visión General](#1-visión-general)
2. [Propuesta de Valor](#2-propuesta-de-valor)
3. [Arquitectura del Sistema](#3-arquitectura-del-sistema)
4. [Modelo de Datos](#4-modelo-de-datos)
5. [Aplicación Store (PWA)](#5-aplicación-store-pwa)
6. [Aplicación Admin](#6-aplicación-admin)
7. [API Backend](#7-api-backend)
8. [Roles y Permisos](#8-roles-y-permisos)
9. [Flujos Operativos](#9-flujos-operativos)
10. [Stack Tecnológico](#10-stack-tecnológico)
11. [Instalación y Desarrollo Local](#11-instalación-y-desarrollo-local)

---

## Estado Actual Verificado (2026-03-21)

- Versión de trabajo del monorepo: `0.1.0`
- El snapshot canónico vigente es [`packages/db/schema/000_core_schema.sql`](/home/mark/Nyro/packages/db/schema/000_core_schema.sql) `v3.1.0`.
- `apps/store` ya opera con la nueva vista `vender`, ticket itemizado, scanner y stock operativo.
- `apps/store` y `apps/api` ya soportan pairing e impresión Bluetooth contra `printer_device`.
- `apps/api` expone hoy rutas reales para `sales`, `sync`, `products`, `inventory`, `reports` y `admin`.
- `apps/admin` está alineada al backend vía `apiClient` y Server Actions delgadas.
- Producción en Neon (proyecto `nyro-roaas`): rama `main` (`br-fragrant-breeze-ae9857ys`), PostgreSQL `17.8`, base operativa `neondb`.
- La rama `main` de producción ya incluye `006_printer_devices.sql`; el snapshot canónico fue actualizado para que deje de quedar detrás de Neon.
- El lookup de barcode en backend sigue este orden:
  - tienda;
  - catálogo;
  - `UPCitemdb`;
  - `SearchUPCData`;
  - facts públicos como fallback final.
- Riesgos técnicos observables hoy:
  - el scanner web requiere `https` o `localhost`;
  - [`apps/store/src/app/(main)/vender/page.tsx`](/home/mark/Nyro/apps/store/src/app/(main)/vender/page.tsx) sigue concentrando demasiado estado;
  - `packages/config/package.json` declara `eslint.config.mjs` en `files`, pero ese archivo no existe todavía.

---

## 1. Visión General

### ¿Qué es Nyro?

**Nyro NO es un POS (Point of Sale).** Nyro es un **backoffice operativo + servicio (ROaaS)** diseñado específicamente para micro-retail en Perú y Latinoamérica.

El sistema está enfocado en resolver dos problemas críticos del retail:

1. **Conciliación multicanal y cierre de caja ultra-rápido** - En un mundo donde los pagos se dividen entre efectivo, Yape, Plin, tarjetas y transferencias, los comerciantes necesitan una forma rápida y confiable de cuadrar su caja al final del día.

2. **Control operativo de inventario y venta itemizada** - Nyro combina catálogo por barcode, productos por tienda, tickets con líneas, recepciones, conteos y ajustes para que la bodega pueda explicar lo que entra, lo que sale y lo que falta.

### Contexto de Micro-Retail

El diseño de Nyro considera las realidades del micro-retail latinoamericano:

| Realidad | Solución Nyro |
|----------|---------------|
| Conectividad inestable | Arquitectura **Online-First (con Offline Fallback)** |
| Hora pico intensa | UX ultra-compacta: **2 gestos, <3 segundos** |
| Múltiples empleados por turno | Trazabilidad completa por usuario |
| Variedad de métodos de pago | 6 canales predefinidos + personalizables |
| Tiendas con y sin POS externo | Modo conciliación para integrar resúmenes |

---

## 2. Propuesta de Valor

### Promesa Principal

> *"Cierra en 5-10 minutos, detecta fugas, y deja de perder ventas por stock invisible."*

### Capacidades Core

| Módulo | Descripción |
|--------|-------------|
| **Cierre de Caja Multicanal** | Registro de ventas por canal (Efectivo, Yape, Plin, POS-QR, Tarjeta, Transferencia) con cierre guiado |
| **Catálogo + Inventario Operativo** | Catálogo por barcode, productos por tienda, recepciones, conteos, ajustes y stock explicable por ledger |
| **Auditoría y Trazabilidad** | Registro completo de quién hizo qué, cuándo y desde qué dispositivo |
| **Soporte ROaaS** | Monitoreo de descuadres, capacitación operativa y mejora continua |

### Lo que Nyro NO hace (Restricciones de Diseño)

- ❌ No reemplaza sistemas POS existentes o ERPs fiscales completos
- ❌ No busca cubrir contabilidad, tributación o facturación electrónica
- ❌ No procesa pagos (solo registra)
- ❌ No emite comprobantes fiscales

---

## 3. Arquitectura del Sistema

### Estructura del Monorepo

Nyro está construido como un **Monorepo** con tres aplicaciones independientes que comparten paquetes de dominio y configuración:

```
nyro/
├── apps/
│   ├── store/          # PWA para operadores de tienda (Next.js, Online-First)
│   ├── admin/          # Panel de administración (Next.js)
│   └── api/            # Backend centralizado (Next.js API Routes)
│
├── packages/
│   ├── domain/         # Tipos, validaciones y entidades compartidas (Fuente de Verdad)
│   ├── db/             # Esquema de base de datos canónico y única fuente de verdad (000_core_schema.sql)
│   └── config/         # Configuraciones compartidas (TS, ESLint, Prettier)
│
├── docs/               # Documentación técnica
└── e2e/                # Tests end-to-end
```

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENTES                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────────┐         ┌──────────────────────┐                 │
│   │    Store PWA         │         │    Admin Panel       │                 │
│   │  (Móvil/Tablet)      │         │    (Desktop)         │                 │
│   │                      │         │                      │                 │
│   │  • Registro ventas   │         │  • Gestión tenants   │                 │
│   │  • Apertura/cierre   │         │  • Reportes          │                 │
│   │  • Conteo inventario │         │  • Auditoría         │                 │
│   │  • Online-First      │         │  • Configuración     │                 │
│   └──────────┬───────────┘         └──────────┬───────────┘                 │
│              │                                │                              │
│              │         HTTPS/REST             │                              │
│              └────────────┬───────────────────┘                              │
│                           ▼                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                           API BACKEND                                        │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                     Next.js Route Handlers                          │   │
│   │                                                                     │   │
│   │  /api/bootstrap    → Configuración inicial por hostname            │   │
│   │  /api/auth/*       → Autenticación (login, PIN, refresh, logout)   │   │
│   │  /api/sales        → Venta atómica inmediata                       │   │
│   │  /api/sync         → Sincronización de eventos (idempotente)       │   │
│   │  /api/products*    → Lookup y creación de productos                │   │
│   │  /api/inventory/*  → Recepciones, conteos y ajustes                │   │
│   │  /api/reports/*    → Reportes y resúmenes                          │   │
│   │  /api/printers/*   → Pairing/listado de impresoras Bluetooth       │   │
│   │  /api/receipts/*   → Registro de impresión de tickets              │   │
│   │  /api/admin/*      → Operaciones administrativas                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                           │                                                  │
│                           ▼                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                        BASE DE DATOS                                         │
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    PostgreSQL + RLS                                 │   │
│   │                                                                     │   │
│   │  • Multi-tenant con aislamiento por Row Level Security             │   │
│   │  • Event Sourcing para sincronización                              │   │
│   │  • Índices optimizados para queries de alto volumen                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Principios Arquitectónicos

| Principio | Implementación |
|-----------|----------------|
| **Online-First** | API Atómica priorizada + IndexedDB Fallback para operaciones críticas |
| **Multi-Tenant** | tenant_id en todas las tablas + RLS como defensa en profundidad |
| **Event Sourcing** | Eventos inmutables con event_id único para deduplicación |
| **Contract-First** | Tipos y validaciones en `@nyro/domain` como única fuente de verdad |

### Reglas de Dependencias

1.  **Strict Boundaries:**
    *   `apps/store` NO puede importar de `apps/api`.
    *   `apps/admin` NO puede importar de `apps/store`.
    *   Solo `apps/api` puede importar `packages/db`.
2.  **Shared Logic:** Toda lógica compartida debe residir en `packages/domain`.

---

## 4. Modelo de Datos

### Visión General del Esquema

El esquema de base de datos se mantiene en un snapshot canónico unificado:

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| **Core Operativo** | Activo | tenants, stores, users, devices, shifts, sales, closures, evidence, sync |
| **Catálogo e Inventario** | Activo | catálogo global, productos por tienda, barcodes, precios, recepciones, conteos, ajustes, ledger y balances |
| **Tickets de Venta** | Activo | `sale_ticket` y `sale_ticket_line` enlazados a `sale_event` para soportar ventas itemizadas sin romper caja ni cierres |
| **Impresión Bluetooth** | Activo | `printer_device` para pairing por tienda, auto-print y bitácora de última conexión |

### Diagrama Entidad-Relación (Módulo Core)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ESTRUCTURA MULTI-TENANT                            │
└─────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    TENANT    │
                                    │ (Organización)│
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
            │    STORE     │       │     USER     │       │    DEVICE    │
            │   (Tienda)   │       │  (Empleado)  │       │ (Dispositivo)│
            └──────┬───────┘       └──────┬───────┘       └──────────────┘
                   │                      │
                   ▼                      │
            ┌──────────────┐              │
            │ STORE_DOMAIN │              │
            │  (Hostname)  │              │
            └──────────────┘              │
                                          │
                    ┌─────────────────────┴─────────────────────┐
                    │                                           │
                    ▼                                           ▼
            ┌──────────────┐                           ┌──────────────┐
            │USER_STORE_ROLE│                          │    SHIFT     │
            │ (Permisos)   │                           │   (Turno)    │
            └──────────────┘                           └──────┬───────┘
                                                              │
                                    ┌─────────────────────────┼─────────────┐
                                    │                         │             │
                                    ▼                         ▼             ▼
                            ┌──────────────┐          ┌──────────────┐  ┌──────────────┐
                            │  SALE_EVENT  │          │   CLOSURE    │  │ POS_SUMMARY  │
                            │   (Venta)    │          │   (Cierre)   │  │(Resumen POS) │
                            └──────────────┘          └──────┬───────┘  └──────────────┘
                                                             │
                                                             ▼
                                                     ┌──────────────┐
                                                     │ CLOSURE_LINE │
                                                     │(Detalle/Canal)│
                                                     └──────────────┘
```

---

### Detalle de Tablas Principales

#### 4.1 TENANT (Organización)

La tabla raíz del sistema multi-tenant. Cada tenant representa una empresa u organización que puede tener múltiples tiendas.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `name` | Nombre de la organización |
| `slug` | Identificador URL único (ej: "mitienda") |
| `settings` | Configuración global en formato JSON |

**Comportamiento:**
- Un tenant agrupa todas las tiendas, usuarios y operaciones de una organización
- El slug se usa para subdominios personalizados (mitienda.nyro.pe)
- No tiene RLS porque es la tabla raíz del árbol de pertenencia

---

#### 4.2 STORE (Tienda)

Representa una ubicación física donde se realizan operaciones de venta y cierre de caja.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `tenant_id` | Organización propietaria |
| `name` | Nombre de la tienda |
| `timezone` | Zona horaria (ej: "America/Lima") |
| `currency` | Moneda (ej: "PEN") |
| `settings` | Configuración: canales habilitados, motivos de diferencia, políticas |
| `active` | Estado activo/inactivo |

**Comportamiento:**
- Cada tienda opera en una zona horaria específica que afecta el cálculo del `business_date`
- Los canales de pago se configuran por tienda en el campo `settings`
- Una tienda puede tener múltiples dominios asociados (store_domain)

---

#### 4.3 STORE_DOMAIN (Mapeo de Dominios)

Permite que cada tienda tenga uno o más hostnames asociados para el bootstrap de la PWA.

| Campo | Descripción |
|-------|-------------|
| `store_id` | Tienda asociada |
| `domain` | Hostname completo (ej: "pos.mitienda.com") |
| `is_canonical` | Si es el dominio principal |

**Comportamiento:**
- Cuando la PWA carga, resuelve el hostname actual para obtener la configuración de tienda
- Solo debe haber un dominio canónico por tienda (los demás redirigen)
- Crítico para el correcto almacenamiento lógico y acceso a la ruta de la API

---

#### 4.4 USER (Empleado/Operador)

Empleados y operadores que trabajan en las tiendas del tenant.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `tenant_id` | Organización empleadora |
| `name` | Nombre completo |
| `phone` | Teléfono (identificador principal para login móvil) |
| `pin_hash` | Hash del PIN rápido (4 dígitos) |
| `email` | Correo electrónico (opcional) |
| `username` | Usuario para login web (opcional) |
| `password_hash` | Hash de contraseña para web |
| `active` | Estado activo/inactivo |

**Comportamiento:**
- Un usuario puede trabajar en múltiples tiendas del mismo tenant
- El PIN permite login rápido en la PWA móvil
- El username/password se usa para acceso al panel de administración
- Los hashes usan **bcrypt** (`bcryptjs`) para seguridad
- **Unique Constraints:** Phone y Username son únicos por Tenant.

---

#### 4.5 USER_STORE_ROLE (Permisos por Tienda)

Asignación de roles específicos por tienda. Un usuario puede tener diferentes roles en diferentes tiendas.

| Campo | Descripción |
|-------|-------------|
| `user_id` | Usuario |
| `store_id` | Tienda |
| `role` | Rol asignado |

**Roles Disponibles:**

| Rol | Descripción | Permisos Principales |
|-----|-------------|----------------------|
| `owner` | Propietario | Todos los permisos, incluyendo configuración |
| `manager` | Gerente | Cierres diarios, reportes, gestión de empleados |
| `cashier` | Cajero/Vendedor | Registro de ventas, apertura y cierre de turno propio |
| `nyro_ops` | Operaciones Nyro | Soporte técnico, solo lectura y auditoría |
| `nyro_admin` | Admin Nyro | Super-administrador del sistema |

**Comportamiento:**
- La relación (user_id, store_id) es única: un usuario solo puede tener un rol por tienda
- Los permisos se verifican tanto en el frontend (UI) como en el backend (API)

---

#### 4.6 DEVICE (Dispositivo Registrado)

Registro de tablets y móviles que operan en las tiendas.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `tenant_id` | Organización |
| `store_id` | Tienda donde opera |
| `device_label` | Nombre amigable (ej: "Caja 1") |
| `device_fingerprint` | Identificador único del dispositivo |
| `last_seen_at` | Última actividad registrada |
| `last_sync_at` | Última sincronización exitosa |

**Comportamiento:**
- Cada dispositivo se registra automáticamente en el primer bootstrap
- El fingerprint permite identificar dispositivos únicos
- Se usa para trazabilidad: saber desde qué dispositivo se registró cada operación
- **Unique Constraint:** `device_fingerprint` es único por tenant.

---

#### 4.7 SHIFT (Turno de Trabajo)

Un turno representa el período de trabajo de un empleado en una tienda.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `tenant_id` | Organización |
| `store_id` | Tienda |
| `user_id` | Empleado que trabaja el turno |
| `device_id` | Dispositivo donde inició sesión |
| `opened_at` | Fecha/hora de apertura |
| `closed_at` | Fecha/hora de cierre (NULL si está abierto) |
| `opening_float` | Fondo inicial en efectivo |
| `status` | Estado: open, closing, closed |

**Estados del Turno:**

| Estado | Descripción |
|--------|-------------|
| `open` | Turno activo, puede registrar ventas |
| `closing` | En proceso de cierre (sincronizando) |
| `closed` | Turno finalizado |

**Regla de Negocio Crítica - Efectivo Compartido:**

> En cada tienda hay UNA sola caja física de efectivo. Solo el **primer turno del día** ingresa el fondo de apertura (`opening_float`). Los turnos posteriores heredan el efectivo acumulado.

```
Ejemplo:
- Turno 1 (08:00): opening_float = S/100, ventas cash = S/50
- Turno 2 (14:00): opening_float = S/0 (hereda la caja), ventas cash = S/80
- Cierre Diario: Efectivo esperado = 100 + 50 + 80 = S/230
```

**Índices Importantes:**
- `idx_shift_tenant_store_opened` para consultar turnos por fecha
- `idx_shift_one_open_per_user_store` (UNIQUE parcial) garantiza solo un turno abierto por usuario/tienda

---

#### 4.8 SALE_EVENT (Registro de Venta) ⭐

**Tabla más importante del sistema.** Registro inmutable de cada venta individual. Es la fuente de verdad para todos los cálculos de ingresos.

| Campo | Descripción |
|-------|-------------|
| `event_id` | Idempotency key generado por el cliente (PK) |
| `tenant_id` | Organización |
| `store_id` | Tienda |
| `shift_id` | Turno activo |
| `user_id` | Vendedor que registró |
| `device_id` | Dispositivo origen |
| `occurred_at_local` | Timestamp del dispositivo (momento real) |
| `occurred_at_server` | Timestamp de recepción en servidor |
| `business_date` | Fecha de negocio (calculada desde timezone de tienda) |
| `channel` | Canal de pago |
| `amount` | Monto de la venta |
| `note_type` | Tipo de nota especial (opcional) |
| `note` | Comentario (opcional) |
| `voided` | Si la venta fue anulada |
| `voided_at` | Timestamp de anulación |
| `voided_reason` | Motivo de anulación |

**Canales de Pago Disponibles:**

| Canal | Descripción | Tipo |
|-------|-------------|------|
| `cash` | Efectivo | Físico |
| `yape` | Billetera Yape | Digital |
| `plin` | Billetera Plin | Digital |
| `pos_qr` | QR del POS | Digital |
| `card` | Tarjeta débito/crédito | Digital |
| `transfer` | Transferencia bancaria | Digital |

**Tipos de Nota Especial:**

| Tipo | Uso |
|------|-----|
| `discount` | Venta con descuento aplicado |
| `credit` | Venta a crédito (fiado) |
| `return` | Devolución |
| `other` | Otro motivo |

**Comportamiento:**
- El `event_id` es generado por la PWA antes de enviar, garantizando idempotencia
- El `business_date` se calcula usando la timezone de la tienda
- Las ventas nunca se eliminan: se anulan (voided = true) con motivo
- Diseñado para sincronización Online-First con fallback automático a la queue local

---

#### 4.9 CLOSURE (Cierre de Caja)

Representa un cierre de caja, que puede ser por turno individual o un cierre diario consolidado.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `tenant_id` | Organización |
| `store_id` | Tienda |
| `shift_id` | Turno individual (NULL si es cierre diario) |
| `shift_ids` | Array de turnos incluidos (para cierre diario) |
| `business_date` | Fecha de negocio del cierre |
| `closed_by_user_id` | Usuario que realizó el cierre |
| `closed_by_role` | Rol del usuario al momento del cierre |
| `closed_at` | Timestamp del cierre |
| `expected_by_channel` | **CACHE:** Totales esperados por canal (JSON) |
| `actual_by_channel` | **CACHE:** Totales declarados por canal (JSON) |
| `diff_by_channel` | **CACHE:** Diferencias por canal (JSON) |
| `status` | Estado: pending, confirmed, reviewed |

**Tipos de Cierre:**

| Tipo | Quién lo hace | `shift_id` | `shift_ids` |
|------|---------------|------------|-------------|
| Cierre de Turno | Cualquier empleado | UUID del turno | NULL |
| Cierre Diario | Manager/Owner | NULL | Array de UUIDs |

**Estados del Cierre:**

| Estado | Descripción |
|--------|-------------|
| `pending` | Creado y pendiente de confirmación |
| `confirmed` | Confirmado por servidor |
| `reviewed` | Revisado por un manager/owner |

---

#### 4.10 CLOSURE_LINE (Detalle de Cierre por Canal)

**Fuente de verdad** para los montos de cada cierre, desglosado por canal de pago.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único (UUID) |
| `closure_id` | Cierre padre |
| `channel` | Canal de pago |
| `expected` | Monto esperado según ventas |
| `actual` | Monto declarado/contado |
| `diff` | Diferencia (actual - expected) |
| `diff_reason_code` | Código del motivo de diferencia |
| `diff_note` | Nota explicativa |

**Principio Importante:**
- Los campos JSON en `closure` son **CACHES** para listados rápidos
- La tabla `closure_line` es la **FUENTE DE VERDAD**
- Si hay discrepancia, `closure_line` tiene prioridad

---

#### 4.11 CLOSURE_SHIFT (Relación Cierre-Turno)

Tabla de relación para cierres diarios que incluyen múltiples turnos.

| Campo | Descripción |
|-------|-------------|
| `closure_id` | ID del Cierre Diario |
| `shift_id` | ID del Turno incluido |

**Propósito:**
- Mantiene integridad referencial entre cierres diarios y sus turnos.
- Permite consultas eficientes de qué turnos componen un cierre diario.
- Ya forma parte del snapshot canónico `v3.1.0` y su creación en entornos existentes quedó absorbida por `005_inventory_ticket_refactor.sql`.

---

#### 4.12 EVIDENCE (Evidencias)

Almacena referencias a archivos adjuntos (fotos, documentos) relacionados con un cierre o una venta individual.

| Campo | Descripción |
|-------|-------------|
| `id` | Identificador único |
| `closure_id` | Cierre asociado (NULL si es venta) |
| `sale_event_id` | Venta asociada (NULL si es cierre) |
| `kind` | Tipo (photo, document, other) |
| `object_url` | URL del archivo en Storage |
| `note` | Nota opcional |

---

#### 4.13 INGESTED_EVENT (Log de Eventos)

Tabla append-only para deduplicación y auditoría de todos los eventos sincronizados.

| Campo | Descripción |
|-------|-------------|
| `seq_id` | Secuencia incremental (BIGSERIAL) para cursores |
| `event_id` | ID único del evento |
| `tenant_id` | Organización |
| `event_type` | Tipo de evento |
| `payload` | Payload completo (JSON) |
| `ingested_at` | Timestamp de ingesta |
| `status` | Estado: accepted, rejected, conflict |

**Comportamiento:**
- El `seq_id` garantiza orden determinista para el cursor de sincronización
- El constraint UNIQUE(tenant_id, event_id) permite idempotencia
- Los eventos rechazados se registran para auditoría sin detener el batch

---

### Catálogo, Inventario y Tickets

El modelo vigente ya no usa el MVP legado basado en `sku/store_sku`. El diseño activo de esta rama es:

| Bloque | Tablas | Propósito |
|-------|--------|-----------|
| Catálogo global | `catalog_product`, `catalog_barcode` | Resolver productos comerciales por barcode y enriquecer datos compartidos |
| Producto por tienda | `store_product`, `store_product_barcode`, `store_product_price` | Adaptar nombre, precio, barcode interno y comportamiento operativo por tienda |
| Ledger de stock | `inventory_movement`, `inventory_balance` | Explicar qué entró, qué salió y cuál es el saldo actual por producto |
| Recepción y conteo | `supplier`, `purchase_receipt`, `purchase_receipt_line`, `stock_count_session`, `stock_count_line`, `stock_adjustment` | Registrar ingresos, conteos y correcciones auditables |
| Venta itemizada | `sale_ticket`, `sale_ticket_line` | Persistir el ticket comercial y sus líneas sin romper `sale_event` ni cierres monetarios |

**Principio del inventario en Nyro:**
- `inventory_movement` es la fuente de verdad del stock.
- `inventory_balance` es una proyección/cache de lectura rápida.
- `sale_event` sigue siendo la fila monetaria para reporting y cierre.
- `sale_ticket` y `sale_ticket_line` describen la venta comercial real.

---

## 5. Aplicación Store (PWA)

### Propósito

La **Store PWA** es la aplicación principal para operadores de tienda. Es una Progressive Web App diseñada para operar en móvil o tablet, con UX de caja rápida, persistencia local con Dexie y sincronización online-first hacia la API.

### Características Principales

| Característica | Descripción |
|----------------|-------------|
| **Online-First** | Prioriza envíos atómicos por API, con fallback a outbox local si no hay internet |
| **Instalable** | Se instala como app nativa desde el navegador |
| **Sincronización** | Eventos y ventas diferidas se sincronizan automáticamente al recuperar conexión |
| **Multi-Usuario** | Cambio rápido de usuario sin reiniciar la app |
| **Barcode Scanner** | Escaneo por cámara para vender y dar de alta productos |

### Navegación Principal

La aplicación tiene una barra de navegación inferior con 4 secciones principales:

```
┌─────────────────────────────────────────────┐
│                                             │
│              [Contenido]                    │
│                                             │
├─────────────────────────────────────────────┤
│  🛒 Vender  │  📊 Turno  │  📋 Diferencias │ 📦 Stock  │
└─────────────────────────────────────────────┘
```

### Pantallas Detalladas

#### 5.1 Pantalla de Vender (Core)

**Objetivo:** Registrar una venta rápida por monto libre o por items escaneados, sin perder compatibilidad con cierre, sync y ticket itemizado.

```
┌─────────────────────────────────────────────┐
│  Juan Pérez                    SALIR        │
│  Total turno: S/ 1,250.00   15 ventas      │
├─────────────────────────────────────────────┤
│                                             │
│          [  Unidad  ] [  Lista  ]           │
│                                             │
│             S/ 0.00          [scan]         │
│                                             │
├─────────────────────────────────────────────┤
│  💵 EFECTIVO   📱 YAPE   📱 PLIN  💳 POS QR │
├─────────────────────────────────────────────┤
│  [1] [2] [3] [⌫]                           │
│  [4] [5] [6] [C]                            │
│  [7] [8] [9]                                │
│  [    0    ]                                │
└─────────────────────────────────────────────┘
```

**Flujo actual de la rama:**
1. Elegir modo `Unidad` o `Lista`
2. Escanear barcode o digitar monto manual
3. En `Unidad`, el numpad interpreta entrada secuencial por centavos: `120` = `S/ 1.20`
4. En `Unidad`, tocar el canal registra la venta
5. En `Lista`, se agregan items o montos y el canal se selecciona recién al final del cobro

**Capacidades actuales del rediseño:**
- scanner de barcode por cámara;
- draft de producto activo al escanear;
- modo `Unidad` para venta rápida de una unidad o monto libre;
- modo `Lista` como ticket itemizado con cantidades, total y cobro final;
- compatibilidad progresiva con ventas legacy `free_amount`;
- integración directa con `sale_ticket`, `sale_ticket_line` e impacto de inventario cuando la venta es itemizada.
- fallback a outbox si `/api/sales` responde `SHIFT_NOT_READY`.

---

#### 5.2 Pantalla de Turno

**Objetivo:** Gestionar el turno del empleado actual.

**Vista con Turno Cerrado:**
```
┌─────────────────────────────────────────────┐
│           ABRIR NUEVO TURNO                 │
├─────────────────────────────────────────────┤
│                                             │
│   🏁 Primer turno del día                   │
│                                             │
│   Ingresa el fondo de apertura:             │
│                                             │
│          [    S/ 100.00    ]                │
│                                             │
│   [      INICIAR TURNO      ]               │
│                                             │
└─────────────────────────────────────────────┘
```

**Vista con Turno Abierto:**
```
┌─────────────────────────────────────────────┐
│       TURNO ACTIVO - Ana García             │
│           ⏱ 4h 23m                          │
├─────────────────────────────────────────────┤
│                                             │
│   Totales del Turno:                        │
│   ├── 💵 Efectivo:    S/ 450.00             │
│   ├── 📱 Yape:        S/ 280.00             │
│   ├── 📱 Plin:        S/ 120.00             │
│   └── 💳 Tarjeta:     S/ 350.00             │
│   ────────────────────────────              │
│       TOTAL:          S/ 1,200.00           │
│                                             │
│   [      CERRAR MI TURNO      ]             │
│                                             │
└─────────────────────────────────────────────┘
```

**Regla de Efectivo Compartido:**
- Si es el **primer turno del día**: se muestra el NumPad para ingresar fondo
- Si **ya hay turnos previos**: se muestra un mensaje de "Efectivo Compartido" y botón directo para abrir

---

#### 5.3 Pantalla de Cierre (Turno Individual)

**Objetivo:** Cerrar un turno individual registrando los totales reales.

```
┌─────────────────────────────────────────────┐
│           CIERRE DE TURNO                   │
├─────────────────────────────────────────────┤
│                                             │
│   Canal      Esperado    Real    Diferencia │
│   ─────────────────────────────────────────│
│   💵 Efectivo  450.00   [    ]    ────      │
│   📱 Yape      280.00   ✓280.00   ✓ 0.00   │
│   📱 Plin      120.00   ✓120.00   ✓ 0.00   │
│   💳 Tarjeta   350.00   ✓350.00   ✓ 0.00   │
│                                             │
│   (Los canales digitales se auto-confirman) │
│                                             │
│   [      FINALIZAR CIERRE      ]            │
│                                             │
└─────────────────────────────────────────────┘
```

**Comportamiento:**
- Los canales digitales (Yape, Plin, Tarjeta) se pre-llenan con el valor esperado
- El efectivo siempre requiere conteo físico (inicia en 0)
- Si hay diferencias, se solicita motivo y nota explicativa

---

#### 5.4 Pantalla de Cierre Diario

**Acceso:** Solo Manager, Owner o Nyro Admin

**Objetivo:** Consolidar todos los turnos del día en un cierre único.

```
┌─────────────────────────────────────────────┐
│         CIERRE DIARIO - 02/02/2026          │
├─────────────────────────────────────────────┤
│                                             │
│   Turnos incluidos:                         │
│   ├── 08:00-14:00  María (S/ 650)          │
│   ├── 14:00-18:00  Juan   (S/ 480)          │
│   └── 18:00-22:00  Pedro  (S/ 720)          │
│                                             │
│   ─────────────────────────────────────────│
│                                             │
│   EFECTIVO ESPERADO:                        │
│   = Fondo apertura (1er turno): S/ 100.00   │
│   + Ventas cash (todos):        S/ 850.00   │
│   ────────────────────────────────────────  │
│   = TOTAL A CONTAR:             S/ 950.00   │
│                                             │
│   Efectivo contado: [         ]             │
│                                             │
│   [      FINALIZAR CIERRE DIARIO      ]     │
│                                             │
└─────────────────────────────────────────────┘
```

**Validaciones:**
- No se puede cerrar el día si hay turnos abiertos
- Todos los turnos del día deben estar cerrados primero
- Si hay diferencias, se debe indicar motivo

---

#### 5.5 Pantalla de Diferencias

**Objetivo:** Bitácora de diferencias detectadas en cierres.

```
┌─────────────────────────────────────────────┐
│              DIFERENCIAS                    │
├─────────────────────────────────────────────┤
│                                             │
│   📅 02/02/2026                             │
│   ├── 💵 Efectivo: -S/ 15.00                │
│   │   Motivo: Vuelto mal dado               │
│   │   Estado: ⏳ Pendiente revisión         │
│   │                                         │
│   📅 01/02/2026                             │
│   ├── 📱 Yape: +S/ 5.00                     │
│   │   Motivo: Error de tipeo               │
│   │   Estado: ✅ Revisado                   │
│                                             │
└─────────────────────────────────────────────┘
```

**Acciones (según rol):**
- Ver detalles de cada diferencia
- Marcar como revisado (Manager/Owner)
- Filtrar por empleado, canal, fecha

---

#### 5.6 Pantalla de Stock

**Objetivo:** Gestión operativa básica de inventario para tienda con foco en barcode, búsqueda rápida y movimientos auditables.

```
┌─────────────────────────────────────────────┐
│                  STOCK                      │
├─────────────────────────────────────────────┤
│                                             │
│   Buscar o registrar producto               │
│                                             │
│   [barcode / nombre / marca] [scan]        │
│                                             │
│   Producto seleccionado                     │
│   ├── stock actual                          │
│   ├── costo promedio                        │
│   └── movimientos recientes                 │
│                                             │
│   ─────────────────────────────────────────│
│                                             │
│   [  REGISTRAR RECEPCIÓN  ] [  INICIAR CONTEO ]│
│   [   AJUSTE / MERMA     ] [  VER MOVIMIENTOS ]│
│                                             │
└─────────────────────────────────────────────┘
```

**Capacidades actuales objetivo:**
- consulta por nombre o barcode;
- lectura de stock actual, costo promedio y último movimiento;
- registro de recepciones, conteos y ajustes;
- soporte para productos con barcode comercial o código interno.

**Capacidades actuales de la rama:**
- lookup de productos y barcodes;
- saldo actual por producto;
- movimientos de inventario;
- registro de recepciones;
- conteos físicos;
- ajustes operativos básicos.

---

### Estado de Sincronización

La PWA muestra siempre el estado de conexión y sincronización:

| Indicador | Significado |
|-----------|-------------|
| 🟢 Online | Conectado y sincronizado |
| 🟡 Pendiente | Hay eventos por sincronizar |
| 🔴 Offline | Sin conexión a internet |

**Comportamiento de Sincronización:**
1. Los eventos y caches operativas se guardan localmente en IndexedDB vía Dexie
2. Se intenta sincronizar automáticamente cuando hay conexión
3. En el cierre de turno, se fuerza sincronización completa
4. Si una venta inmediata no puede proyectarse, se deriva al outbox para posterior sync

---

## 6. Aplicación Admin

### Propósito

El **Panel de Administración** es el centro operativo para gestionar tenants, tiendas, usuarios y revisar la actividad operativa. Está diseñado para uso en escritorio.

### Usuarios Objetivo

| Usuario | Uso Principal |
|---------|---------------|
| **Owner** | Gestionar su tienda, revisar cierres, aprobar diferencias |
| **Manager** | Revisar turnos, cierres y diferencias de sus empleados |
| **Nyro Ops** | Soporte técnico, monitoreo de anomalías |
| **Nyro Admin** | Gestión de tenants y configuración del sistema |

### Navegación Principal

```
┌────────────────────────────────────────────────────────────────┐
│  NYRO ADMIN                                    👤 Admin User   │
├──────────────┬─────────────────────────────────────────────────┤
│              │                                                 │
│  📊 Dashboard│                                                 │
│  🏪 Tiendas  │              [Contenido Principal]              │
│  👥 Usuarios │                                                 │
│  📋 Turnos   │                                                 │
│  💰 Cierres  │                                                 │
│  📝 Auditoría│                                                 │
│  🏢 Tenants* │                                                 │
│              │                                                 │
│  * Solo Admin│                                                 │
│              │                                                 │
└──────────────┴─────────────────────────────────────────────────┘
```

### Pantallas Detalladas

#### 6.1 Dashboard

Vista general de la operación con métricas clave:

- **Ventas del día** por tienda
- **Turnos activos** en tiempo real
- **Cierres pendientes** de revisión
- **Alertas** de descuadres significativos

---

#### 6.2 Gestión de Tiendas

**Listado de Tiendas:**
- Nombre, estado (activa/inactiva)
- Dominios asociados
- Número de usuarios

**Detalle de Tienda:**
- Información general (nombre, timezone, moneda)
- Dominios configurados
- Canales de pago habilitados
- Usuarios asignados y sus roles

**Acciones:**
- Crear nueva tienda
- Editar configuración
- Agregar/quitar dominios
- Desactivar tienda

---

#### 6.3 Gestión de Usuarios

**Listado de Usuarios:**
- Nombre, teléfono, email
- Tiendas asignadas
- Estado (activo/inactivo)

**Detalle de Usuario:**
- Información personal
- Roles por tienda
- Historial de actividad

**Acciones:**
- Crear nuevo usuario
- Editar información
- Asignar/cambiar roles
- Resetear PIN
- Desactivar usuario

---

#### 6.4 Gestión de Turnos

**Listado de Turnos:**
- Filtros: tienda, empleado, fecha, estado
- Información: empleado, duración, total vendido

**Detalle de Turno:**
- Empleado y dispositivo
- Hora de apertura y cierre
- Desglose de ventas por canal
- Cierre asociado (si existe)

---

#### 6.5 Gestión de Cierres

**Listado de Cierres:**
- Filtros: tienda, tipo (turno/diario), estado, fecha
- Información: tipo, monto total, diferencia neta, estado

**Detalle de Cierre:**
- Información general (quién, cuándo, desde qué dispositivo)
- Desglose por canal (esperado vs real)
- Diferencias con motivos
- Evidencia adjunta (fotos)
- Estado de revisión

**Acciones:**
- Marcar como revisado
- Agregar nota de auditoría

---

#### 6.6 Auditoría

**Listado de Eventos:**
- Filtros: tipo de evento, tienda, usuario, fecha
- Información: tipo, timestamp, usuario, payload

**Tipos de Eventos Auditados:**
- Creación de ventas
- Anulación de ventas
- Apertura y cierre de turnos
- Cierres de caja
- Ajustes de inventario
- Cambios de configuración

---

#### 6.7 Gestión de Tenants (Solo Nyro Admin)

**Listado de Tenants:**
- Nombre, slug, número de tiendas
- Fecha de creación

**Detalle de Tenant:**
- Información de la organización
- Configuración global
- Tiendas asociadas

**Acciones:**
- Crear nuevo tenant
- Editar configuración
- Crear usuario administrador inicial

---

## 7. API Backend

### Propósito

El **Backend API** es el punto central de comunicación entre las aplicaciones cliente y la base de datos. Implementa la lógica de negocio, autenticación, autorización y sincronización.

### Endpoints Principales

#### 7.1 Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/login` | Login con username/password | No |
| POST | `/api/auth/pin` | Login rápido con PIN | No |
| POST | `/api/auth/refresh` | Renovar access token | No |
| POST | `/api/auth/logout` | Cerrar sesión | Sí |

**Tokens:**
- **Access Token:** JWT corto (15 min), usado para todas las operaciones
- **Refresh Token:** JWT largo (7 días), usado solo para renovar access token

---

#### 7.2 Bootstrap

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/bootstrap` | Configuración inicial por hostname | No |

**Respuesta incluye:**
- Información de la tienda (id, nombre, timezone, moneda)
- Canales de pago habilitados
- Lista de usuarios con roles
- Si hay turnos abiertos hoy

**Uso:** La PWA llama a este endpoint al cargar para obtener toda la configuración necesaria.

**Comportamiento real:**
- resuelve por `store_domain`;
- retorna usuarios, canales, razones de diferencia, políticas y estado de turnos;
- responde con `Cache-Control: private, no-store, max-age=0`.

---

#### 7.3 Ventas

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/sales` | Registrar venta atómica inmediata | Sí |

**Características:**
- soporta ventas `free_amount` e `itemized`;
- valida ticket cuando `sale_kind = itemized`;
- proyecta contra `sale_event` y `sale_ticket*` cuando aplica;
- puede devolver `409` con `code = SHIFT_NOT_READY` si el turno aún no existe en servidor.

---

#### 7.4 Sincronización

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/sync` | Enviar batch de eventos | Sí |
| GET | `/api/sync` | Obtener stats de sync para admin | Sí |

**Características:**
- **Idempotente:** Eventos duplicados se ignoran automáticamente
- **Batch:** Hasta 50 eventos por request
- **Transaccional:** Procesamiento protegido con savepoints por evento
- **Cursor:** Usa `ingested_event.seq_id`

**Tipos de Eventos:**
- `sale.created` - Venta registrada
- `sale.voided` - Venta anulada
- `shift.opened` - Turno abierto
- `shift.closed` - Turno cerrado
- `closure.created` - Cierre de turno creado
- `daily_closure.created` - Cierre diario creado

---

#### 7.5 Productos e Inventario

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Listar productos de tienda | Sí |
| POST | `/api/products` | Crear producto de tienda | Sí |
| GET | `/api/products/lookup` | Lookup por barcode | Sí |
| POST | `/api/inventory/receipts` | Registrar recepción | Sí |
| POST | `/api/inventory/count-sessions` | Registrar conteo | Sí |
| POST | `/api/inventory/adjustments` | Registrar ajuste | Sí |

**Lookup de barcode:**
- busca primero en tienda y catálogo;
- luego consulta `UPCitemdb`;
- luego `SearchUPCData`;
- finalmente cae a bases públicas de facts.

---

#### 7.6 Reportes

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/reports/day-summary` | Resumen del día | Sí |

**Parámetros:**
- `storeId` - Tienda (requerido)
- `date` - Fecha de negocio (requerido)
- `userId` - Filtrar por vendedor (opcional)

**Respuesta incluye:**
- Lista de turnos con sus totales
- Información de efectivo compartido (cashFlow)
- Totales por canal
- Vendedores que participaron

---

#### 7.7 Administración

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/admin/alerts` | Alertas operativas | Admin |
| GET/POST | `/api/admin/tenants` | Gestión de tenants | Admin |
| GET/POST | `/api/admin/stores` | Gestión de tiendas | Admin |
| GET/POST | `/api/admin/users` | Gestión de usuarios | Admin |
| GET | `/api/admin/sales` | Listado de ventas | Admin |
| GET | `/api/admin/shifts` | Listado de turnos | Admin |
| GET | `/api/admin/closures` | Listado de cierres | Admin |
| GET | `/api/admin/audit` | Eventos de auditoría | Admin |
| GET | `/api/admin/dashboard` | Métricas del dashboard | Admin |

---

### Manejo de Errores

La API devuelve errores estructurados:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "El monto debe ser mayor a 0",
    "details": { "field": "amount" }
  }
}
```

**Códigos de Error Comunes:**

| Código | HTTP Status | Descripción |
|--------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Token inválido o expirado |
| `FORBIDDEN` | 403 | Sin permisos para la operación |
| `NOT_FOUND` | 404 | Recurso no encontrado |
| `VALIDATION_ERROR` | 400 | Datos de entrada inválidos |
| `CONFLICT` | 409 | Conflicto operativo |
| `SHIFT_NOT_READY` | 409 | El turno existe localmente pero aún no fue proyectado en servidor |
| `INTERNAL_ERROR` | 500 | Error interno del servidor |

---

## 8. Roles y Permisos

### Matriz de Permisos por Rol

| Permiso | Cashier | Manager | Owner | Nyro Ops | Nyro Admin |
|---------|:-------:|:-------:|:-----:|:--------:|:----------:|
| Registrar ventas | ✅ | ✅ | ✅ | ❌ | ✅ |
| Anular ventas propias | ✅ | ✅ | ✅ | ❌ | ✅ |
| Abrir turno | ✅ | ✅ | ✅ | ❌ | ✅ |
| Cerrar turno propio | ✅ | ✅ | ✅ | ❌ | ✅ |
| Cerrar turno de otros | ❌ | ✅ | ✅ | ❌ | ✅ |
| Cierre diario | ❌ | ✅ | ✅ | ❌ | ✅ |
| Ver reportes tienda | ❌ | ✅ | ✅ | ✅ | ✅ |
| Marcar diferencia revisada | ❌ | ✅ | ✅ | ❌ | ✅ |
| Gestionar usuarios tienda | ❌ | ❌ | ✅ | ❌ | ✅ |
| Configurar tienda | ❌ | ❌ | ✅ | ❌ | ✅ |
| Ver auditoría | ❌ | ❌ | ✅ | ✅ | ✅ |
| Gestionar tenants | ❌ | ❌ | ❌ | ❌ | ✅ |
| Acceso multi-tenant | ❌ | ❌ | ❌ | ✅ | ✅ |

### Verificación de Permisos

Los permisos se verifican en dos niveles:

1. **Frontend (UI):** Oculta elementos no permitidos para el rol
2. **Backend (API):** Valida permisos antes de ejecutar operaciones

**Componentes de Verificación:**
- `RoleGuard` - Componente React para proteger UI
- `canManageStore()` - Helper para verificar permisos de gestión
- `authorizeReportAccess()` - Middleware de autorización en API

---

## 9. Flujos Operativos

### 9.1 Flujo Diario Típico

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DÍA DE OPERACIÓN TÍPICO                             │
└─────────────────────────────────────────────────────────────────────────────┘

  08:00 ─┬─ TURNO 1 (María - Cajera)
         │  ├── Abre turno con fondo S/100
         │  ├── Registra ventas (2 taps cada una)
         │  └── Cierra turno a las 14:00
         │
  14:00 ─┼─ TURNO 2 (Juan - Cajero)
         │  ├── Abre turno (sin fondo - efectivo compartido)
         │  ├── Registra ventas
         │  └── Cierra turno a las 20:00
         │
  20:00 ─┼─ TURNO 3 (Pedro - Cajero)
         │  ├── Abre turno (sin fondo - efectivo compartido)
         │  ├── Registra ventas
         │  └── Cierra turno a las 22:00
         │
  22:00 ─┴─ CIERRE DIARIO (Pedro - Manager)
            ├── Sistema consolida todos los turnos
            ├── Calcula efectivo esperado correctamente
            ├── Manager cuenta efectivo físico
            ├── Confirma canales digitales
            ├── Registra diferencias (si hay)
            └── Finaliza cierre del día
```

---

### 9.2 Flujo de Registro de Venta (2 Taps)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          REGISTRO DE VENTA                                   │
└─────────────────────────────────────────────────────────────────────────────┘

  PASO 1: Ingresar Monto                    PASO 2: Seleccionar Canal
  ┌─────────────────────┐                   ┌─────────────────────┐
  │                     │                   │                     │
  │     S/ 45.50       │     ─────────>    │   [💵 EFECTIVO]     │
  │                     │      < 1 seg      │                     │
  │  [Teclado numérico] │                   │   Venta registrada  │
  │                     │                   │   ✓ Confirmación    │
  └─────────────────────┘                   └─────────────────────┘

  Resultado:
  ├── Evento sale.created guardado en IndexedDB
  ├── Contador del turno actualizado instantáneamente
  ├── Sincronización automática (si hay conexión)
  └── Feedback háptico (vibración)
```

---

### 9.3 Flujo de Cierre de Turno

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CIERRE DE TURNO                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  1. RESUMEN ESPERADO
     ├── Sistema muestra totales por canal
     └── Calculado automáticamente de las ventas

  2. INGRESO DE REALES
     ├── Canales digitales: Pre-llenados (verificar)
     └── Efectivo: Ingreso manual obligatorio (conteo físico)

  3. DETECCIÓN DE DIFERENCIAS
     ├── Si hay diferencia → Seleccionar motivo
     ├── Motivos predefinidos o nota libre
     └── Opción de adjuntar foto

  4. SINCRONIZACIÓN
     ├── Fuerza envío directo a la plataforma API
     ├── Espera confirmación del servidor
     └── Si error de red → Lanza aviso correspondiente

  5. CONFIRMACIÓN
     └── Cierre finalizado con folio único
```

---

### 9.4 Flujo de Cierre Diario

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          CIERRE DIARIO                                       │
└─────────────────────────────────────────────────────────────────────────────┘

  PREREQUISITOS:
  ├── Todos los turnos del día deben estar cerrados
  └── Solo Manager, Owner o Nyro Admin pueden ejecutar

  1. CONSOLIDACIÓN
     ├── Sistema lista todos los turnos del día
     ├── Calcula efectivo esperado:
     │   = opening_float (solo 1er turno)
     │   + ventas_cash (todos los turnos)
     └── Muestra totales por canal consolidados

  2. VERIFICACIÓN
     ├── Manager/Owner verifica canales digitales
     └── Cuenta efectivo físico de la caja

  3. DIFERENCIAS
     ├── Cualquier diferencia se documenta
     └── Se indica motivo y responsable

  4. FINALIZACIÓN
     ├── Evento daily_closure.created
     ├── Sincronización obligatoria
     └── Día cerrado (no se pueden agregar más turnos)
```

---

### 9.5 Flujo de Sincronización Online-First con Fallback

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                SINCRONIZACIÓN ONLINE-FIRST CON FALLBACK                       │
└─────────────────────────────────────────────────────────────────────────────┘

  INTENTO DIRECTO A API (Siempre ocurre primero)
  ┌──────────────────────────────────────┐
  │  Usuario registra venta/acción       │
  │           ↓                          │
  │  1. Generar event_id único           │
  │  2. Intentar POST a API              │
  │  3. Si falla red: guardar en Outbox  │
  │  4. Actualizar UI inmediatamente     │
  └──────────────────────────────────────┘
              │
              ▼
  SYNC EN BACKGROUND
  ┌──────────────────────────────────────┐
  │  ¿Hay conexión?                      │
  │     │                                │
  │     ├── SÍ → Enviar batch a /sync    │
  │     │        ↓                       │
  │     │        Servidor deduplica      │
  │     │        ↓                       │
  │     │        ACK recibido            │
  │     │        ↓                       │
  │     │        Marcar como sincronizado│
  │     │                                │
  │     └── NO → Mantener en cola        │
  │              (reintento automático)  │
  └──────────────────────────────────────┘

  GARANTÍAS:
  ├── Idempotencia: event_id único evita duplicados
  ├── Orden: seq_id del servidor garantiza secuencia
  ├── Resiliencia: Savepoints para eventos fallidos
  └── Checkpoints: Cierre fuerza sync completo
```

---

## 10. Stack Tecnológico

### Lenguajes y Runtimes

| Tecnología | Uso |
|------------|-----|
| **TypeScript** | Lenguaje principal (end-to-end) |
| **Node.js** | 18+ (Runtime de desarrollo) |
| **PostgreSQL** | 17+ (Base de datos, Neon) |

### Frameworks y Librerías

| Área | Tecnología | Versión |
|------|------------|---------|
| **Frontend** | Next.js (App Router) | 15.x |
| **React** | React | 19.x |
| **State Management** | Zustand | 5.x |
| **Local Database** | Dexie (IndexedDB) | 4.x |
| **Validación** | Zod | 3.x |
| **Estilos** | Tailwind CSS | 3.x |
| **Monorepo** | Turborepo | 2.x |
| **Package Manager** | pnpm | 9.x |

### Infraestructura

| Servicio | Uso |
|----------|-----|
| **Vercel** | Deploy de las 3 aplicaciones |
| **Neon PostgreSQL** | Base de datos serverless |
| **Vercel Functions** | Ejecución del backend |

### Seguridad

| Mecanismo | Descripción |
|-----------|-------------|
| **JWT** | Tokens de acceso y refresco |
| **bcryptjs** | Hashing de contraseñas y PINs |
| **RLS** | Row Level Security en PostgreSQL |
| **HTTPS** | Comunicación encriptada |

### PWA (Progressive Web App)

| Característica | Implementación |
|----------------|----------------|
| **Service Worker** | Cache de assets y app-shell |
| **IndexedDB** | Almacenamiento local estructurado |
| **Web Manifest** | Instalación como app nativa |
| **Push Notifications** | Preparado (no activo en MVP) |

---

## 11. Instalación y Desarrollo Local

---

## Observabilidad y Performance (Sentry)

- Runbook operativo: [docs/sentry-performance-runbook.md](docs/sentry-performance-runbook.md)
- Variables de entorno (Store): [apps/store/.env.example](apps/store/.env.example)
- Variables de entorno (API): [apps/api/.env.example](apps/api/.env.example)

### Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **pnpm**: Recomendado v9.x (instalar con `npm i -g pnpm`)
- **Docker** (opcional, para DB local, aunque se recomienda Neon)

### Pasos Iniciales

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/apunto-tech/nyro.git
    cd nyro
    ```

2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```

3.  **Configurar variables de entorno:**
    *   Copia `.env.example` a `.env` en cada paquete/app necesario.
    *   `apps/api/.env`: Configura `DATABASE_URL` (Neon).
    *   `apps/store/.env`: Configura `NEXT_PUBLIC_API_URL`.

4.  **Iniciar entorno de desarrollo:**
    ```bash
    pnpm dev
    ```
    Esto iniciará todas las aplicaciones en paralelo usando Turborepo.

### Comandos Comunes

- `pnpm build`: Construir todas las aplicaciones.
- `pnpm lint`: Ejecutar linter en todo el monorepo.
- `pnpm test`: Ejecutar tests unitarios.
- `pnpm test:e2e`: Ejecutar tests end-to-end con Playwright.

---

## Documentación Adicional

- [AGENTS.md](./AGENTS.md): Guías para agentes de IA y detalles de arquitectura.
- [.agent/rules/](./.agent/rules/): Reglas de codificación y estándares.
- [CHANGELOG.md](./CHANGELOG.md): Auditoría histórica de cambios, incidentes reportados y correcciones aplicadas por fecha.
- [docs/db_schema_analysis.md](./docs/db_schema_analysis.md): Estado y drift de esquema entre código y producción.
- [docs/store_pwa_technical_flows.md](./docs/store_pwa_technical_flows.md): Flujos técnicos completos de la PWA Store (endpoints, contratos, sync, DB local y validaciones).

---

<div align="center">

**© 2026 Nyro Operations**

*Retail Operations as a Service*

</div>
