//
// Cote UI de l'application "lucioles"
//
// Auteur : G.MENEZ
// RMQ : Manipulation naive (debutant) de Javascript
// 
let node_url = 'http://localhost:3000';
window.onload = function init() {

    //=== Initialisation des traces/charts de la page html

    // Apply time settings globally
    Highcharts.setOptions({
	global: { // https://stackoverflow.com/questions/13077518/highstock-chart-offsets-dates-for-no-reason
            useUTC: false,
            type: 'spline'
	},
	time: {
	    timezone: 'Europe/Paris'
	}
    });

    // cf https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/spline-irregular-time/
    var chart1 = new Highcharts.Chart({
        title: {
            text: 'Temperatures'
        },
	subtitle: {
            text: 'Irregular time data in Highcharts JS'
	},
        legend: {
            //title: {
            //    text: 'Temperatures'
            //},
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container1'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Temperature (Deg C)'
            }
        },
        series: [{name: 'ESP1', data: []},
		 {name: 'ESP2', data: []},
         {name: 'ESP3', data: []},
         {name: 'ESP4', data: []},
         {name: 'ESP5', data: []},
		],

	//colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
	colors: ['red', 'green', 'blue','yellow', 'purple'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                //color: "red",
                enableMouseTracking: true
            }
        }
    });

    var chart2 = new Highcharts.Chart({
        title: { text: 'Lights' },
        legend: {
            //title: {
            //    text: 'Lights'
            //},
            enabled: true
        },
        credits: false,
        chart: {renderTo: 'container2'},
        xAxis: {
            title: {
                text: 'Heure'
            },
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'Lumen (Lum)'
            }
        },
	series: [{name: 'ESP1', data: []},
		 {name: 'ESP2', data: []},
         {name: 'ESP3', data: []},
         {name: 'ESP4', data: []},
         {name: 'ESP5', data: []}],

	//colors: ['#6CF', '#39F', '#06C', '#036', '#000'],
	colors: ['red', 'green', 'blue', 'yellow', 'purple'],
	
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        }
    });

    
    //=== Recuperation dans le Node JS server des samples de l'ESP et 
    //=== Alimentation des charts ====================================

    function get_samples(path_on_node, serie, wh){
	// path_on_node => help to compose url to get on Js node
	// serie => for choosing chart/serie on the page
	// wh => which esp do we want to query data
	
	//node_url = 'http://localhost:3000'
	//node_url = 'https://node-tp3.herokuapp.com'
	//node_url = 'http://10.9.128.189:3000'
	/* node_url = 'http://192.168.1.102:3000' */

	//https://openclassrooms.com/fr/courses/1567926-un-site-web-dynamique-avec-jquery/1569648-le-fonctionnement-de-ajax
        $.ajax({
            url: node_url.concat(path_on_node), // URL to "GET" : /esp/temp ou /esp/light
            type: 'GET',
            headers: { Accept: "application/json", },
	    data: {"who": wh}, // parameter of the GET request
            success: function (resultat, statut) { // Anonymous function on success
                let listeData = [];
                resultat.forEach(function (element) {
		    listeData.push([Date.parse(element.date),element.value]);
		    //listeData.push([Date.now(),element.value]);
                });
                serie.setData(listeData); //serie.redraw();
            },
            error: function (resultat, statut, erreur) {
            },
            complete: function (resultat, statut) {
            }
        });
    }

    $("#lights").click(function(state){
     
        $.ajax({
           url : node_url,
           type : 'POST', // Le type de la requête HTTP
           data : 'state=' + state , // On passe l'etat voulu des LED
           dataType : 'html'
        });
       
    });
   /*  function lights(state){
        if(state) 
    } */
    //=== Installation de la periodicite des requetes GET=============
    
    function process_esp(which_esps,i){
	const refreshT = 100000 // Refresh period for chart
	esp = which_esps[i];    // L'ESP "a dessiner"
	//console.log(esp) // cf console du navigateur
	
	// Gestion de la temperature
	// premier appel pour eviter de devoir attendre RefreshT
	get_samples('/esp/temp', chart1.series[i], esp);
	//calls a function or evaluates an expression at specified
	//intervals (in milliseconds).
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/temp',     // param 1 for get_samples()
			   chart1.series[i],// param 2 for get_samples()
			   esp);            // param 3 for get_samples()

	// Gestion de la lumiere
	get_samples('/esp/light', chart2.series[i], esp);
	window.setInterval(get_samples,
			   refreshT,
			   '/esp/light',     // URL to GET
			   chart2.series[i], // Serie to fill
			   esp);             // ESP targeted
    }
    

    //=== Gestion de la flotte d'ESP =================================

    var which_esps = ["1761716416",
		      "B4:E6:2D:96:78:D9",
              "80:7D:3A:FD:E8:E8",
              "30:AE:A4:86:CA:7C",
              "80:7D:3A:FD:DD:08"
            ]
    for (var i = 0; i < which_esps.length; i++) {
	process_esp(which_esps, i)
    }
};
