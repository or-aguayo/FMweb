<template>
  <div class="welcomeContainer">
    <h1>FMweb - Vari::Ation</h1>
    <br>
    <h4>
      This is an integrated prototype of FMweb and Vari::Ation.
    </h4>
    <h5>There is a <a href="/Template.xml" download>template</a> file that you can download by clicking on the link to get you started, just import it when you want to use it.</h5>
    <div>
      <img src="/Template.png" width="70%">
    </div>
    
    <h4>
      More Information:
    </h4>
    <ul>
      <li>This project is based on <a href="https://github.com/GabrielGuzman05/FMweb">FMweb</a> and <a href="https://gitlab.com/abobadilla02/configurationmodel">Vari::Ation</a>.</li>
      <li>Funded by the project DI20-0060 from the <a href="https://www.ufro.cl/">Universidad de La Frontera</a>.</li>
      <li>Developed by Alonso Bobadilla (2019-2020), Ignacio Fernández (2020), Gabriel Guzmán (2021) and Jorge Echeverría (2022).</li>
    </ul>
  </div>
</template>

<script>

export default{
  name: 'WelcomeView',
  publicPath: process.env.BASE_URL
}
</script>

<style lang="scss">
.welcomeContainer {
  width: 100%;
  height: 100%;
}
</style>
