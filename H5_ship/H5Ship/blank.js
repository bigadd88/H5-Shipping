<!DOCTYPE html>
<html>
<head>
   <META HTTP-EQUIV="CACHE-CONTROL" CONTENT="NO-CACHE">
   <meta name="viewport" content="width=device-width, initial-scale=1">

   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
   <link rel="stylesheet" href="../Nav_pages/galleryCSS.css">

</head>  
<body class='homeBG' >

<header>
   <nav id='nav' class="navbar navbar-dark bg-dark">
       
   </nav>

</header>





<footer>

</footer>

</body>

<script>
   document.getElementById('nav').innerHTML = '<span><img onclick="pressButton()"  src="../Nav_Pages/CozmicCornbread.png" hight='+screen.height*.05+' width='+screen.width*.05+'></img></span><a href="../Nav_pages/home.html"></a></div><a href="../Nav_pages/page1.html" target="_blank">Gallery</a><a href="../Nav_pages/page2.html" > Information</a><a href="../Nav_pages/page3.html" > Games Page</a>';
  // document.getElementById('homeimg').innerHTML = "<img src='file:///home/cozmiccornbread/Documents/Nav_pages/home.jpeg' hight="+screen.height*.05+" width="+screen.width*.05+"></img>" // <a href='../Nav_pages/home.html' target='_blank'></a>
   function pressButton(){
       window.location = '../Nav_pages/home.html'
   }
   
</script>
</html>