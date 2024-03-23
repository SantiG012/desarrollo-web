function generate(){
	var lastname= ["Yate", "Botella", "Almohada", "Cadena", "Videojuego", "Maleta", "Avion", "Carro", "Moto", "Dinero", "Camisa", "Medias", "Bicicleta", "Gancho", "Pajaro", "Guantes", "Arte", "Sandia", "Arroz", "Futbolista", "Correa", "Bomberos", "Edificio",
	"Cama", "Sabana", "Audifonos", "Pelo", "Queso", "Vaca", "Jirafa", "Hipopotamo", "Manzana", "Uva", "Microfono", "Pantalon", "Gorra", "Rubio", "Armario", "Cajon", "Cobija", "Perfume", "Medalla", "Pistola", "Asiatico", "Correo", "Policia", "Lozano", "ELN", "Batman", "Psicologa", "Ingeniero", "Calvo", "Cruz", "Bolsa", "Basura", "Leon", "Herradura", "Ajedrez", "Piña", "Cabra", "Flores", "Campo", "Cartas", "Diez", "Fuentes", "Carrasco", "Caballero", "Nieto", "Reyes", "Aguila", "Conejo de Pascua", "Herrero", "Santanas", "Luces", "Helicoptero", "Montaña", "Izquirda", "Gay", "Ferrari", "Tucan", "Escuela", "Boxeo", "Mora", "Fotografia", "Michael Jordan", "Gimnasio", "Carpintero", "Criticando", "Roma", "Pastor", "Spaguettis", "Vestido", "Maquina", "Cejas", "Boca", "Spide-Man", "Barba", "Uña", "Gallina", "Sancocho", "Historia", "Nieve", "Verano", "Camion", "Fiesta", "Globo", "Rivalidad", "Silvar", "Lago", "Pastel", "Pescar", "Redondo", "Cuadrado", "Rey", "Reina", "Trebol", "Almuerzo", "Galan", "Cena", "Rio", "Peluche", "Secuestro", "Cristiano", "Messi", "Neymar", "Television", "Cafe"];
	var rand_last = Math.floor(Math.random()*lastname.length); 
	document.getElementById('result').innerHTML = "<h1>DIBUJARAS:</h1><div class='alert alert-success'><h2>"+lastname[rand_last]+"</h2></div>";
	
}



