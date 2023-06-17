# Utiliza una imagen base de Node.js
FROM node:18

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/docker

# Copia los archivos package.json y package-lock.json al directorio de trabajo
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia los archivos de la API al directorio de trabajo
COPY . .

# Expone el puerto 3000 para acceder a la API
EXPOSE 3000

# Comando para ejecutar la aplicación cuando se inicie el contenedor
# CMD [ "node", "index.js" ]
