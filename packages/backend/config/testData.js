import { Usuario } from '../models/Usuario.js';
import { Notificacion } from '../models/Notificacion.js';
import { Categoria } from '../models/Producto.js';

// TODO: REMOVER ESTE ARCHIVO EN PRODUCCIÓN
// Esta función crea datos de prueba y debe ser eliminada cuando se implemente autenticación real
export const initTestData = async () => {
  try {
    // Verificar si ya existe el usuario de prueba
    let testUser = await Usuario.findOne({ email: 'usuario.prueba@test.com' });

    if (!testUser) {
      testUser = new Usuario({
        nombre: 'Usuario de Prueba',
        email: 'usuario.prueba@test.com',
        telefono: '+54 11 1234-5678',
        direccion: {
          calle: 'Av. Corrientes 1234',
          ciudad: 'Buenos Aires',
          codigoPostal: '1043'
        }
      });

      await testUser.save();
      console.log('✅ Usuario de prueba creado:', testUser.email);
    } else {
      console.log('ℹ️  Usuario de prueba ya existe:', testUser.email);
    }

    // Crear notificación de prueba si no existe
    const existingNotification = await Notificacion.findOne({
      usuarioId: testUser._id,
      titulo: 'Bienvenido al sistema'
    });

    if (!existingNotification) {
      const testNotification = new Notificacion({
        usuarioId: testUser._id,
        titulo: 'Bienvenido al sistema',
        mensaje: 'Esta es una notificación de prueba. Puedes usarla para probar los endpoints de marcar como leída/no leída.',
        tipo: 'sistema',
        leida: false
      });

      await testNotification.save();
      console.log('✅ Notificación de prueba creada para usuario:', testUser.email);
    } else {
      console.log('ℹ️  Notificación de prueba ya existe para usuario:', testUser.email);
    }

    // ===== Categorías por default =====
    const categoriasDefault = ['running', 'calzado', 'indumentaria'];
    for (const nombre of categoriasDefault) {
      const existing = await Categoria.findOne({ nombre });
      if (!existing) {
        const categoria = new Categoria({ nombre });
        await categoria.save();
        console.log('✅ Categoría creada:', nombre);
      } else {
        console.log('ℹ️  Categoría ya existe:', nombre);
      }
    }

    return testUser;
  } catch (error) {
    console.error('❌ Error creando datos de prueba:', error.message);
    throw error;
  }
};