# Test de Orientación Vocacional · Prototipo front-end

Maquetación en **React + TypeScript + Tailwind CSS v4** del diseño de Figma
_"Test orientación vocacional Trabajito"_, página **Test web**.
Es solo front-end: los datos son mock y no hay llamadas a la API.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en /dist
```

## Flujo de pantallas

| Ruta | Pantalla (frame de Figma) |
|---|---|
| `/` | Landing completa (`lan.png` / frame `94`): hero, Tu viaje, beneficios, testimonios, FAQ, CTA |
| `/login`, `/registro`, `/registro-exitoso` | Login ("¡Hola de nuevo!"), Crea tu cuenta, Registro exitoso |
| `/recuperar`, `/recuperar/nueva` | Recuperar contraseña: pedir enlace, "Revisa tu correo" y crear la nueva |
| `/cargando?next=…` | Carga login / Carga registro |
| `/intro` | Inicio del estudiante: panel de las 2 etapas con su avance y botón para cerrar sesión |
| `/test/personalidad` | Test de personalidad: 4 secciones de 15 preguntas (60), un ♥ por sección, como en Figma |
| `/test/bloque-1` | Intereses profesionales A/B, 60 preguntas en 4 secciones → ★ x4 |
| `/test/bloque-2` | Casos prácticos: unir cada opción (A–D) con un puesto (1–4) mediante líneas → ◆ |
| `/test/bloque-3` | Enfoque de interés: escribir 1…N en cada actividad (propuesta C, escribir con ayuda: barra de números usados, salto automático a la siguiente casilla, repetidos en rojo) → 🏆 |
| `/resultados` | Estilo personal, Preferencias vocacionales, Planes de estudio |

Cada bloque sigue la misma secuencia: tutorial, práctica, "¡Perfecto!", carga,
preguntas y animación de recompensa (`src/components/flow.tsx`).

## Estructura

```
src/
  index.css              tokens de diseño (colores, fuentes) y tema claro/oscuro
  context/AppContext.tsx tema, incentivos ganados y respuestas del usuario
  data/testData.ts       preguntas (mock extraído de Figma)  ← reemplazar por la API
  data/resultsData.ts    resultados (mock)                    ← reemplazar por la API
  components/            UI compartida (botones, encabezados, recompensas, íconos, logo)
  pages/                 una página por pantalla o bloque
public/images/           ilustraciones y fotos de actividades (WebP)
```

## Integración con el back-end

- Las respuestas se guardan en `useApp().answers`, agrupadas por bloque:
  `personality`, `block1`, `block2` y `block3`.
- Login y registro solo navegan. Hay que conectar los `onSubmit` en `src/pages/Auth.tsx` y `src/pages/Register.tsx`.
- El botón "Descargar informe completo" usa `window.print()` como placeholder.
- El modo oscuro se activa con la clase `.dark` en `<html>`. Los colores semánticos
  (`bg-surface`, `bg-footer`, `text-fg`…) cambian solos según el tema.

## Cambios de la auditoría heurística aplicados

- Progreso guardado en `localStorage` (respuestas, incentivos y pregunta actual). "Salir" pide confirmación y se puede continuar desde la intro o la landing.
- Turquesa accesible `#1f7a8c` (`bg-action`) en fondos con texto blanco; textos grises a `#6b7280`.
- Una sola tipografía: Poppins.
- Duración, progreso global (barra superior) y leyenda de incentivos en la introducción.
- Recompensas sin detener el test: un incentivo en la esquina inferior derecha (`RewardCharger`) se llena como un vaso con cada respuesta; al completar la sección tiembla, vuela a su lugar en la fila de arriba y aparece "¡Corazón ganado! 1 de 4". El test sigue mientras tanto.
- Fin de etapa o bloque (`Reward`): pantalla completa con los incentivos fundiéndose en una insignia dorada, destello, rayos y fuegos artificiales. Personalidad: "¡Ya conocemos tu personalidad! · Empezar test vocacional". Respeta `prefers-reduced-motion`.
- Atajos de teclado: 1–5 (personalidad), A/B o flechas (bloque 1). Bloque 2: opciones a la izquierda y puestos 1–4 (Más importante, Importante, Moderado, Menos importante) a la derecha; se unen arrastrando (mouse o dedo, con línea en vivo) o tocando la opción y luego el número. Soltar sobre un número ocupado intercambia; tocar un número unido lo desune. Estilo plano de Figma: casillas grises punteadas y líneas turquesa.
- El líquido del cargador (corazón, estrella, diamante) se llena por área del ícono, no por altura, para que se note desde la primera respuesta.
- La pantalla de logro (fin de etapa o bloque) tiene fondo de galaxia: nebulosas, estrellas que titilan, estrellas fugaces, luna y planeta con anillo (sin animación con "reducir movimiento").
- Pantalla final ("¡Terminaste tu test!"): además, lluvia de confeti, saludo con el nombre del estudiante, resumen "Tu colección completa" (4 corazones, 4 estrellas, diamante y trofeo) y un cohete que despega del planeta con anillo y aterriza en la luna.
- Al entrar a un bloque, las recompensas de los bloques anteriores se completan (4 corazones, 4 estrellas, diamante), por si una animación de recompensa se interrumpió.
- Login y registro con etiquetas visibles, validación en línea y estados de error. Para ver el error de credenciales, entra con un correo que empiece con `error@` (por ejemplo `error@correo.com`).
- Lenguaje más llano en resultados y tabla detallada plegable.
- Correcciones de ortografía y contenido.

## Registro (propuesta A)

- Una pantalla con 6 campos en dos columnas: nombre, correo, grado (lista), unidad educativa (buscador), contraseña y celular opcional.
- Se quitaron "Nombre de usuario" (el login usa el correo) y "Confirmar contraseña".
- Casilla obligatoria de términos, privacidad y autorización del tutor.
- Al crear la cuenta va al login con el correo ya escrito y un aviso de éxito; solo falta la contraseña.
- Grados y colegios de ejemplo en `src/data/registroData.ts`: el back-end debe reemplazar la lista de colegios por la oficial. Si un colegio no está, el estudiante puede usar lo que escribió (llega con `id: null`).

## Login (propuesta A · espejo del registro)

- Misma estructura que el registro (componente `AuthSplit`): formulario a la izquierda y, a la derecha, un panel de marca con logo, pingüino y mensaje que ocupa todo el espacio libre.
- Un solo título ("¡Hola de nuevo!"), botón "Entrar" y "¿No tienes cuenta? Crea una" debajo del botón.
- Recuperación de contraseña en 3 pasos. El aviso de envío no confirma si el correo existe. En "Revisa tu correo" hay un enlace marcado como *Prototipo* que simula abrir el correo: quitarlo al conectar el back-end.

## Inicio del estudiante (propuesta C · panel de etapas)

- Muestra las 2 etapas del test: **personalidad** y **vocacional** (con sus 3 bloques), cada una con su estado: pendiente, en curso o completada.
- La primera vez invita a empezar; al volver muestra el porcentaje de avance y un solo botón para continuar. Al terminar todo, lleva a los resultados.
- Contenido en una tarjeta blanca sobre fondo turquesa suave. Barra superior a todo el ancho: logo a la izquierda; tema y **menú de perfil** a la derecha (componente `ProfileMenu`).
- Menú de perfil: avatar y primer nombre; al abrirlo muestra nombre completo, correo, avance y **Cerrar sesión** (en rojo, con confirmación si hay una etapa a medias). En celular se abre como hoja desde abajo. Se maneja con teclado (flechas y Escape).
- Los minutos por etapa (10, 12, 8 y 5; unos 35 en total) son estimados: medirlos con estudiantes reales.
- Sin back-end, el nombre solo se conoce si el estudiante se registró en ese navegador. Si no, el avatar muestra un ícono de persona y el saludo queda en "¡Hola!" (ya no se inventa desde el correo).

## Práctica guiada (propuesta B de tutoriales)

- Sin ventanas de tutorial ni de "¡Perfecto!". Cada bloque abre en **modo práctica** con 1 pregunta de ejemplo; la etiqueta "Modo práctica" pulsa 4 veces al entrar.
- El pingüino (`penguinCoach.webp`) aparece entre la pregunta y las opciones con una frase de qué hacer y "Saltar práctica".
- Una manito animada (`DemoHand`) demuestra la interacción sobre los elementos reales: recorre las opciones (personalidad), pasa de una tarjeta a otra (bloque 1), en el bloque 2 la manito está integrada al tablero: aclara "No tiene que ser A con 1", arrastra la C hasta el 1 dibujando la línea y luego toca el 1 para quitarla (no cambia las respuestas reales). En el bloque 3 también está integrada: escribe el 1 en la 3.ª actividad (no va en el orden de la lista), muestra la barra de números y enseña cómo se marca un repetido. Se repite hasta que el estudiante toca la pantalla. Con "reducir movimiento" queda quieta.
- Al responder la práctica aparece una transición (`PracticeTransition`): sticker "¡Así de fácil!" con confeti, el mensaje "Ahora empieza … de verdad · tus respuestas ya cuentan" y una cuenta regresiva 3·2·1 (o "Empezar ya"); luego arranca el test real. La práctica no se repite si ya se hizo o se saltó (`tv-practiced` en localStorage).

## Pendiente

- Test de personalidad: Figma repite las mismas 15 preguntas en las 4 secciones y así quedó (`PERSONALITY_ITEMS` en `src/data/testData.ts`). Si el cuestionario real tiene preguntas distintas por sección, cargarlas ahí.

- Envío real del correo de recuperación y validación del enlace (token) en `/recuperar/nueva`.
- Ilustración del login: el pingüino sostiene un formulario que dice "Usuario"; cambiar a "Correo" (tarea de diseño).
- Enlaces de "términos y condiciones" y "política de privacidad" del registro (hoy apuntan a #).
- Respuestas de las preguntas frecuentes en `src/data/landingData.ts`: son provisionales (confirmar "¿Es gratis?").
- Sugerencia de "Responsabilidad" en `src/data/resultsData.ts`: el diseño traía "Falso"; se dejó un texto provisional.
- Bloque 3: en Figma, el área **Ambiental** muestra una 4.ª tarjeta vacía ("del 1 al 4");
  por ahora tiene 3 actividades (escala 1–3). Confirmar si falta una.
