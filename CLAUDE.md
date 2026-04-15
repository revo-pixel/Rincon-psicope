# CLAUDE.md — Entre Rizos Psicope

## Descripción del Proyecto
E-commerce de materiales psicopedagógicos digitales (kits de informes, guías, packs de actividades, protocolos). El flujo de venta actual cierra por WhatsApp. Cliente: psicopedagoga.

**Branding:** Entre Rizos Psicope. Logo en Header (h-28/h-32) y de fondo en Hero (opacity-35).

## Repositorio
- **GitHub:** https://github.com/revo-pixel/Rincon-psicope.git
- **Rama principal:** main

## Stack

| Tecnología | Uso |
|---|---|
| React 19 + TypeScript | Framework principal |
| Vite 7 | Build tool |
| Tailwind CSS v4 | Estilos |
| Zustand 5 | Estado global |
| React Router v7 | Rutas |
| GSAP + @gsap/react | Animaciones (solo Hero y header de productos) |
| Supabase | Backend y base de datos |
| clsx + tailwind-merge | Clases dinámicas |
| lucide-react | Iconos |

## Estructura

```
src/
├── components/
│   ├── admin/AdminPanel.tsx
│   ├── Cart.tsx
│   ├── CheckoutModal.tsx
│   ├── CTA.tsx
│   ├── Features.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── Hero.tsx              ← animado con GSAP
│   ├── ProductCard.tsx       ← hover animado con GSAP
│   ├── ProductModal.tsx
│   ├── ProductsSection.tsx   ← scroll reveal header con GSAP (cards SIN GSAP)
│   ├── Testimonials.tsx
│   └── WhatsAppButton.tsx
├── lib/supabase.ts
├── pages/
│   ├── Admin.tsx
│   └── Home.tsx             ← llama fetchProducts() en useEffect
├── store/
│   ├── adminStore.ts
│   ├── cartStore.ts          ← persist con localStorage
│   └── productStore.ts       ← conectado a Supabase
├── types/index.ts
└── utils/
```

## Rutas

| Ruta | Componente | Acceso |
|---|---|---|
| `/` | Home | Público |
| `/admin` | Admin | Público (login) |
| `/admin/panel` | AdminPanel | Protegido |

## Paleta
- Principal: `from-rose-500 to-purple-500`
- Texto: `from-rose-600 via-pink-600 to-purple-600`
- Fondo Hero: `from-rose-100 via-pink-50 to-purple-100`

## Reglas GSAP (estrictas)
1. Siempre `gsap.registerPlugin()` para plugins
2. Usar `timeline` para secuencias
3. `autoAlpha` en lugar de `opacity`
4. Siempre `useGSAP()` de `@gsap/react`
5. Nunca animar `top`, `left`, `margin`
6. **NO usar GSAP con `autoAlpha: 0` en elementos que cargan async** — quedan congelados si ya están en viewport cuando llegan los datos

## Animaciones activas
- **Hero.tsx:** Timeline de entrada (badge → título → subtítulo → botones → stats) + blobs flotando + logo de fondo (opacity-35)
- **ProductCard.tsx:** Hover `y: -8, scale: 1.02` + zoom imagen `scale: 1.07`
- **ProductsSection.tsx:** Scroll reveal solo del header. Las cards NO tienen animación GSAP (se quitó por conflicto con carga asíncrona de Supabase)

## Supabase

**Credenciales** (hardcodeadas en `src/lib/supabase.ts` — vite-plugin-singlefile rompe env vars)
- URL: `https://ctfhyftixrnlwvjensqz.supabase.co`
- Key: `sb_publishable_HAvS05ejG9MASgdrT1BMkw_qyrlSoUU`
- Región: South America (São Paulo)

### Tabla: `products`
| Campo | Tipo |
|---|---|
| id | uuid PK |
| name | text |
| short_description | text |
| description | text |
| price | numeric |
| category | text |
| images | text[] |
| featured | boolean |
| created_at | timestamptz |

### RLS
- `anon` + `authenticated`: SELECT libre
- Solo `authenticated`: INSERT, UPDATE, DELETE

### Mapeo snake_case → camelCase (productStore.ts)
```ts
{ short_description → shortDescription, description → fullDescription }
```

## Estado Global (Zustand)
- **productStore:** sin persist, conectado a Supabase. `fetchProducts()` se llama en `Home.tsx` via `useEffect`
- **cartStore:** con persist en localStorage
- **adminStore:** auth solo client-side (NO segura — pendiente migrar a Supabase Auth)

## Tipos principales
```ts
interface Product { id, name, shortDescription, fullDescription, price, images[], category, featured? }
interface CartItem { product: Product, quantity: number }
interface CustomerData { fullName, email, phone, address, city, paymentMethod: 'mercadopago' | 'transfer' }
```

## Convenciones
- Archivos: PascalCase (`ProductCard.tsx`)
- Variables/funciones: camelCase
- Solo Tailwind CSS, sin CSS custom salvo excepciones
- Precios: `Intl.NumberFormat` con locale `es-AR` y currency `ARS`
- **NO hacer push por cada cambio.** Solo cuando se pida explícitamente.

---

## Pendientes para producción

| # | Tarea | Prioridad |
|---|---|---|
| 1 | **Supabase Auth** para admin (reemplazar adminStore client-side) | Alta |
| 2 | **Tabla `orders`** en Supabase (`id, cart_json, customer_email, payment_id, status`) | Alta |
| 3 | **MercadoPago** — integración real en checkout (actualmente deriva a WhatsApp) | Alta |
| 4 | **Supabase Storage** — subida de imágenes desde admin panel (actualmente URLs de Unsplash) | Media |
| 5 | **Deploy en Vercel** — conectar GitHub + env vars | Media |
| 6 | **Página de éxito/error** post-pago | Media |
| 7 | **Email de confirmación** al comprador (Resend, 3k emails/mes gratis) | Baja |
| 8 | **SEO** — meta tags, Open Graph, favicon | Baja |
