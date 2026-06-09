# Biblioteca Digital API

API REST para gestionar una biblioteca digital. Node.js · Express · MongoDB Atlas · Mongoose · bcrypt · ES6 Modules · MVC.

## Tecnologías

- Node.js v18+
- Express v4
- MongoDB Atlas + Mongoose
- bcrypt
- dotenv
- ES6 Modules

## Instalación

```bash
git clone https://github.com/mayerlyuribe/apiRest-bilbioteca.git
cd apiRest-bilbioteca
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz:

```
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/biblioteca-api
PORT=3000
BCRYPT_SALT_ROUNDS=10
```

## Correr el proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

---

## Endpoints

### Auth

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /api/auth/register | Registro de usuario con password encriptado |
| POST | /api/auth/login | Login — verifica con bcrypt |

**POST /api/auth/register**
```json
// Request
{
  "nombre": "Ana López",
  "email": "ana@email.com",
  "password": "123456",
  "rol": "admin"
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "664a1f...",
    "nombre": "Ana López",
    "email": "ana@email.com",
    "rol": "admin",
    "createdAt": "2025-06-01T10:00:00.000Z"
  }
}
```

**POST /api/auth/login**
```json
// Request
{
  "email": "ana@email.com",
  "password": "123456"
}

// Response 200
{
  "success": true,
  "data": {
    "_id": "664a1f...",
    "nombre": "Ana López",
    "email": "ana@email.com",
    "rol": "admin"
  }
}

// Response 401
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

---

### Authors

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/authors | Listar todos los autores |
| POST | /api/authors | Crear autor |
| GET | /api/authors/:id | Obtener autor por ID |
| PUT | /api/authors/:id | Actualizar autor |
| DELETE | /api/authors/:id | Eliminar autor |

**POST /api/authors**
```json
// Request
{
  "nombre": "Gabriel García Márquez",
  "nacionalidad": "Colombiana",
  "fechaNacimiento": "1927-03-06"
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "664a2c...",
    "nombre": "Gabriel García Márquez",
    "nacionalidad": "Colombiana",
    "fechaNacimiento": "1927-03-06T00:00:00.000Z"
  }
}
```

**GET /api/authors**
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "_id": "664a2c...",
      "nombre": "Gabriel García Márquez",
      "nacionalidad": "Colombiana",
      "fechaNacimiento": "1927-03-06T00:00:00.000Z"
    }
  ]
}
```

---

### Books

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/books | Listar libros — acepta ?genre= y ?authorId= combinables |
| POST | /api/books | Crear libro |
| GET | /api/books/:id | Obtener libro por ID (con autor) |
| PUT | /api/books/:id | Actualizar libro |
| DELETE | /api/books/:id | Eliminar libro |
| GET | /api/books/:id/availability | Copias disponibles en tiempo real |

**POST /api/books**
```json
// Request
{
  "titulo": "Cien Años de Soledad",
  "isbn": "978-0-06-088328-7",
  "genero": "fiction",
  "anio": 1967,
  "copiasDisponibles": 5,
  "author": "664a2c..."
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "664a3e...",
    "titulo": "Cien Años de Soledad",
    "isbn": "978-0-06-088328-7",
    "genero": "fiction",
    "anio": 1967,
    "copiasDisponibles": 5,
    "author": "664a2c..."
  }
}
```

**GET /api/books?genre=fiction&authorId=664a2c...**
```json
// Response 200
{
  "success": true,
  "data": [
    {
      "_id": "664a3e...",
      "titulo": "Cien Años de Soledad",
      "genero": "fiction",
      "author": {
        "_id": "664a2c...",
        "nombre": "Gabriel García Márquez"
      }
    }
  ]
}
```

**GET /api/books/:id/availability**
```json
// Response 200
{
  "success": true,
  "data": {
    "titulo": "Cien Años de Soledad",
    "copiasDisponibles": 4,
    "disponible": true
  }
}
```

---

### Readers

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/readers | Listar lectores |
| POST | /api/readers | Crear lector |
| GET | /api/readers/:id | Obtener lector por ID |
| PUT | /api/readers/:id | Actualizar lector |
| DELETE | /api/readers/:id | Eliminar lector |

**POST /api/readers**
```json
// Request
{
  "nombre": "Carlos Ruiz",
  "email": "carlos@email.com",
  "membresia": "premium"
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "664a4f...",
    "nombre": "Carlos Ruiz",
    "email": "carlos@email.com",
    "membresia": "premium",
    "activo": true
  }
}
```

---

### Loans

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /api/loans | Listar préstamos con populate — acepta ?status= y ?genre= |
| POST | /api/loans | Crear préstamo |
| GET | /api/loans/:id | Obtener préstamo por ID con populate completo |
| PATCH | /api/loans/:id/status | Cambiar solo el estado |

**POST /api/loans**
```json
// Request
{
  "fechaPrestamo": "2025-06-01T10:00:00.000Z",
  "fechaDevolucionEsperada": "2025-06-15T10:00:00.000Z",
  "book": "664a3e...",
  "reader": "664a4f...",
  "notas": "Préstamo urgente"
}

// Response 201
{
  "success": true,
  "data": {
    "_id": "664a5a...",
    "fechaPrestamo": "2025-06-01T10:00:00.000Z",
    "fechaDevolucionEsperada": "2025-06-15T10:00:00.000Z",
    "estado": "active",
    "book": "664a3e...",
    "reader": "664a4f..."
  }
}
```

**GET /api/loans?status=active**
```json
// Response 200
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "664a5a...",
      "estado": "active",
      "fechaPrestamo": "2025-06-01T10:00:00.000Z",
      "fechaDevolucionEsperada": "2025-06-15T10:00:00.000Z",
      "book": {
        "_id": "664a3e...",
        "titulo": "Cien Años de Soledad",
        "genero": "fiction",
        "author": {
          "_id": "664a2c...",
          "nombre": "Gabriel García Márquez"
        }
      },
      "reader": {
        "_id": "664a4f...",
        "nombre": "Carlos Ruiz",
        "email": "carlos@email.com"
      }
    }
  ]
}
```

**PATCH /api/loans/:id/status**
```json
// Request
{
  "estado": "returned"
}

// Response 200
{
  "success": true,
  "data": {
    "_id": "664a5a...",
    "estado": "returned",
    "fechaDevuelto": "2025-06-10T08:00:00.000Z"
  }
}
```

---

## Notas

- El campo `password` nunca se retorna en ninguna respuesta.
- Al crear un préstamo, `copiasDisponibles` del libro se decrementa automáticamente.
- Al marcar un préstamo como `returned`, `copiasDisponibles` se incrementa automáticamente.
- Un lector no puede tener más de 3 préstamos activos simultáneamente.
- La `fechaDevolucionEsperada` debe ser posterior a la `fechaPrestamo`.