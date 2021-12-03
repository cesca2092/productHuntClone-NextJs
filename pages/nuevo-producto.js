import Layout from '../components/layout/Layout';
import React, { useContext, useState } from 'react';
import { css } from '@emotion/react';
import Router, { useRouter } from 'next/router';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';

import { FirebaseContext } from '../firebase';

//validaciones
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

import { collection, addDoc } from "firebase/firestore";


const STATE_INICIAL = {
  nombre: '',
  empresa:'',
  imagen:'',
  url:'',
  descripcion:''
}


const NuevoProducto = () => {
  
  const [error, guardarError] = useState(false);

  const {
    valores,
    errores,
    handleSubmit,
    handleChange,
    handleBlur
  } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

  const { nombre, empresa, imagen, url, descripcion }= valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(FirebaseContext);

  const {db} = firebase

  async function crearProducto(){
    //si el usuario no esta autenticado llevar al login
    if(!usuario){
      return router.push('/login');
    }

    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now()
    }

    //insertarlo en la base de datos
    const productos = await addDoc(collection(db,"productos"),(producto))
  }

  return ( 
    <div>
      <Layout>
        <>
          <h1
            css={css`
              text-align: center;
              margin-top: 5rem;
            `}
          >Nuevo Producto</h1>
          <Formulario
            onSubmit={handleSubmit}
            noValidate
          >
            <fieldset>
              <legend>Informacion General</legend>
            
              <Campo>
                <label htmlFor='nombre'>Nombre</label>
                <input
                  type='text'
                  id='nombre'
                  placeholder='Tu Nombre'
                  name='nombre'
                  value={nombre}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.nombre && <Error>{errores.nombre}</Error>}

              <Campo>
                <label htmlFor='empresa'>Empresa</label>
                <input
                  type='text'
                  id='empresa'
                  placeholder='Nombre Empresa'
                  name='empresa'
                  value={empresa}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.empresa && <Error>{errores.empresa}</Error>}


              {/* <Campo>
                <label htmlFor='imagen'>Imagen</label>
                <input
                  type='file'
                  id='imagen'
                  name='imagen'
                  value={imagen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.imagen && <Error>{errores.imagen}</Error>} */}

              <Campo>
                <label htmlFor='url'>URL</label>
                <input
                placeholder='URL de tu producto'
                  type='url'
                  id='url'
                  name='url'
                  value={url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.url && <Error>{errores.url}</Error>}
            </fieldset>

            <fieldset>
              <legend>Sobre tu Producto</legend>
              <Campo>
                <label htmlFor='descripcion'>Descripcion</label>
                <textarea
                  id='descripcion'
                  name='descripcion'
                  value={descripcion}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Campo>
              {errores.descripcion && <Error>{errores.descripcion}</Error>}
            
            </fieldset>            

            {error && <Error>{error}</Error>}
            <InputSubmit 
              type='submit'
              value='Crear Producto'
            />
          </Formulario>
        </>
      </Layout>
    </div>
   );
}
 
export default NuevoProducto;