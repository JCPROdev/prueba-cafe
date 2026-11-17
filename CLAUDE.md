@AGENTS.md

# Resumen del Proyecto

Landing page comercial para una cafetería con catálogo de productos (marca, descripciones cortas, precios e imágenes) y panel de administración protegido con control de acceso por roles (`ADMIN` y `EMPLOYEE`) más registro de auditoría (audit log) de cada cambio realizado. Despliegue objetivo en Vercel.

- **Stack Base:** Next.js (App Router), TypeScript (modo estricto), Tailwind CSS, `pnpm`.
- **CMS y Medios:** `next-sanity`, `@sanity/client`, `@sanity/image-url` (almacenamiento de productos e identidad de marca; mutaciones ejecutadas vía Server Actions con token de servidor para garantizar trazabilidad).
- **Base de Datos y ORM:** `prisma` y `@prisma/client` sobre PostgreSQL (gestión de cuentas de usuario, roles y tabla `AuditLog`).
- **Autenticación y Seguridad:** `next-auth` (Auth.js v5 con Credentials Provider para email y contraseña) y `bcryptjs` (hashing de contraseñas).
- **Validación y UI:** `zod` (validación estricta en cliente y servidor), `lucide-react` (iconografía ligera), `sonner` (notificaciones en el panel), `clsx` y `tailwind-merge`.
- **Animaciones:** `gsap` y `@gsap/react` (animaciones GPU-aceleradas, modulares y bajo demanda).

# Comandos Frecuentes

Ejecuta únicamente estos comandos desde la raíz del proyecto:

- `pnpm install` — Instala o actualiza las dependencias del proyecto.
- `pnpm dev` — Inicia el servidor local de desarrollo en `http://localhost:3000`.
- `pnpm lint` — Ejecuta ESLint para validar reglas de estilo y calidad de código.
- `pnpm exec tsc --noEmit` — Verifica errores de tipado en TypeScript sin generar compilación.
- `pnpm exec prisma generate` — Regenera el cliente de Prisma tras modificar `prisma/schema.prisma`.
- **Prohibición explícita:** No ejecutes `pnpm build` como comando de verificación habitual.

# Arquitectura y Estructura de Carpetas

Crea y respeta esta estructura interna dentro de `src/`:

```text
src/
├── app/
│   ├── (public)/                  # Landing page pública de la cafetería (Server Components)
│   │   ├── page.tsx               # Hero, identidad de marca, catálogo de productos y contacto
│   │   └── layout.tsx             # Navbar y Footer públicos
│   ├── (auth)/
│   │   └── login/page.tsx         # Acceso con correo electrónico y contraseña
│   ├── admin/                     # Panel de administración protegido
│   │   ├── layout.tsx             # Navegación lateral filtrada según rol (ADMIN / EMPLOYEE)
│   │   ├── page.tsx               # Vista general del panel
│   │   ├── productos/             # Gestión CRUD de productos en Sanity (ADMIN y EMPLOYEE)
│   │   ├── usuarios/              # Gestión CRUD de empleados y roles (SOLO ADMIN)
│   │   └── auditoria/             # Registro cronológico de cambios quién/qué/cuándo (SOLO ADMIN)
│   ├── api/
│   │   └── auth/[...nextauth]/route.ts
│   ├── error.tsx                  # Captura de errores en tiempo de ejecución
│   ├── not-found.tsx              # Página 404 personalizada
│   └── layout.tsx                 # RootLayout (fuentes, metadatos SEO, Toaster)
├── components/
│   ├── ui/                        # Primitivas reutilizables (Button, Input, Modal, Table, Badge)
│   ├── landing/                   # Secciones visuales (HeroSection, ProductGrid, ProductCard, BrandSection)
│   ├── admin/                     # Interfaces del panel (ProductForm, UserForm, AuditLogTable)
│   └── animations/                # Wrappers ligeros de GSAP (RevealOnScroll, StaggerProducts)
├── lib/
│   ├── sanity/
│   │   ├── client.ts              # Cliente público de lectura y cliente privado de escritura (server-only)
│   │   ├── queries.ts             # Consultas GROQ tipadas para productos y marca
│   │   └── image.ts               # Generador de URLs optimizadas de Sanity
│   ├── actions/                   # Server Actions por dominio
│   │   ├── product.actions.ts     # Mutaciones en Sanity + registro obligatorio en AuditLog
│   │   ├── user.actions.ts        # CRUD de usuarios en DB + registro en AuditLog (solo ADMIN)
│   │   └── auth.actions.ts        # Inicio y cierre de sesión
│   ├── db.ts                      # Singleton de PrismaClient
│   ├── auth.ts                    # Configuración Auth.js, JWT con rol y guards de autorización
│   ├── audit.ts                   # Helper centralizado createAuditLog()
│   ├── validations.ts             # Esquemas Zod para productos, usuarios y login
│   └── utils.ts                   # Utilidades puras (formateo de moneda, fechas y cn())
├── hooks/
│   └── use-gsap-reveal.ts         # Hook encapsulado con useGSAP y limpieza automática
├── types/
│   ├── sanity.ts                  # Interfaces de Product, Category y BrandInfo
│   ├── auth.ts                    # Tipos Role ('ADMIN' | 'EMPLOYEE') y sesión extendida
│   └── actions.ts                 # Contrato estándar ActionResult<T>
└── middleware.ts                  # Protección de /admin/* y bloqueo de /admin/usuarios y /admin/auditoria a EMPLOYEE
```

- **Flujo de Datos:** Lee el catálogo público desde Sanity usando caché de Next.js (`revalidateTag` / `revalidatePath` al mutar productos). Ejecuta todas las escrituras de Sanity desde `product.actions.ts` para interceptar cada cambio y guardarlo en `AuditLog`.

# Convenciones de Next.js y Código

- **Server Components vs. Client Components:**
  - Usa Server Components por defecto en todas las páginas (`page.tsx`) y layouts (`layout.tsx`).
  - Declara `'use client'` únicamente en componentes hoja interactivos (formularios, modales, controles) o wrappers de animación GSAP. Nunca marques páginas completas como `'use client'`.
- **Autorización y Roles (RBAC):**
  - Verifica la sesión activa y el rol dentro de cada Server Action antes de mutar datos; nunca confíes solo en el middleware o en ocultar botones en la UI.
  - Restringe el rol `EMPLOYEE` exclusivamente a operaciones sobre productos. Rechaza inmediatamente cualquier acción en usuarios o auditoría si `role !== 'ADMIN'`.
- **Animaciones Ligeras con GSAP:**
  - Usa exclusivamente `@gsap/react` (`useGSAP`) dentro de `src/components/animations/` para asegurar limpieza automática del contexto y evitar fugas de memoria.
  - Registra plugins (`ScrollTrigger`) únicamente en los componentes que los requieran; nunca los importes en `src/app/layout.tsx`.
  - Anima únicamente propiedades aceleradas por GPU (`transform`, `opacity`, `clip-path`). Prohibido animar propiedades de layout (`width`, `height`, `top`, `left`, `margin`).
  - Envuelve las animaciones de desplazamiento en `gsap.matchMedia()` para respetar `prefers-reduced-motion`.
- **TypeScript Estricto y Validación:**
  - Prohibido usar `any` o aserciones forzadas (`as unknown as`). Tipa todas las respuestas GROQ, modelos de Prisma y props.
  - Valida siempre los datos entrantes en las Server Actions con `zod` antes de interactuar con Sanity o PostgreSQL.
- **Manejo de Errores e Imágenes:**
  - Retorna siempre el contrato `ActionResult<T>` (`{ success: true; data: T } | { success: false; error: string }`) en todas las Server Actions.
  - Configura `cdn.sanity.io` en `next.config.ts` y usa siempre `next/image` para renderizar productos.

# Reglas Estrictas para el Agente

- **NUNCA ejecutar `pnpm build`** ni generar compilaciones de producción hasta que el usuario lo ordene explícitamente al finalizar el proyecto.
- **Usar exclusivamente `pnpm`** para instalar dependencias o ejecutar scripts (prohibido usar `npm`, `npx`, `yarn` o `bun`).
- **Validar cambios solo con comprobación estática:** Tras escribir o modificar código, ejecuta únicamente `pnpm exec tsc --noEmit` y `pnpm lint`.
- **Auditoría obligatoria:** Nunca crees una Server Action de creación, edición o eliminación (de productos o usuarios) sin invocar `createAuditLog()` con el identificador del usuario activo, acción, entidad afectada y resumen del cambio.
- **Mantener el bundle ligero:** No instales librerías de UI pesadas (MUI, Ant Design, Chakra) ni librerías de animación adicionales (Framer Motion); usa únicamente Tailwind CSS y GSAP modular.
