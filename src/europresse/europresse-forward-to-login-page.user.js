// ==UserScript==
// @version      1.0.5
// @description  europresse-forward-to-login-page
// ==/UserScript==

// @import{monkeyGetSetValue}
// @import{createElementExtended}
// @import{getElements}

const ophirofoxStruct = [
        {
          "name": "Pas d'intermédiaire",
          "AUTH_URL": "https://nouveau.europresse.com/Login",
          "pattern": "https://nouveau.europresse.com/*",
        },
        {
          "name": "Aix-Marseille Université",
          "AUTH_URL": "https://lama.univ-amu.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031032T_1",
          "pattern": "https://nouveau-europresse-com.lama.univ-amu.fr/*",
        },
        {
          "name": "Bibliotheque nationale du Luxembourg",
          "AUTH_URL": "http://proxy.bnl.lu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U030612T_1",
          "pattern": "https://nouveau-europresse-com.proxy.bnl.lu/*",
        },
        {
          "name": "Bibliothèque et Archives nationales du Québec (BAnQ)",
          "AUTH_URL": "http://res.banq.qc.ca/login?url=https://nouveau.eureka.cc/access/ip/default.aspx?un=bnat1",
          "pattern": "https://nouveau-eureka-cc.res.banq.qc.ca/*",
        },
        {
          "name": "Bibliotheque nationale et universitaire de Strasbourg",
          "AUTH_URL": "https://acces-distant.bnu.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=bnus",
          "AUTH_URL_MEDIAPART": "www-mediapart-fr.acces-distant.bnu.fr",
          "pattern": "https://nouveau-europresse-com.acces-distant.bnu.fr/*",
        },
        {
          "name": "Bibliotheque municipale de Lyon",
          "AUTH_URL": "https://connect.bm-lyon.fr/get/login?&access_list=LVAw&url=aHR0cHM6Ly9ub3V2ZWF1LmV1cm9wcmVzc2UuY29tL2FjY2Vzcy9odHRwcmVmL2RlZmF1bHQuYXNweD91bj1CTUxZT05BVV8x"
        },
        {
          "name": "BNF",
          "AUTH_URL": "https://bnf.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000067U_1",
          "pattern": "https://nouveau-europresse-com.bnf.idm.oclc.org/*",
          "AUTH_URL_ARRETSURIMAGES" : "www-arretsurimages-net.bnf.idm.oclc.org",
          "AUTH_URL_MEDIAPART": "www-mediapart-fr.bnf.idm.oclc.org",
          "AUTH_URL_PRESSREADER" : "www-pressreader-com.bnf.idm.oclc.org"
        },
        {
          "name": "Bibliothèque Publique d'Information (BPI)",
          "AUTH_URL": "https://bpi.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=pompi",
          "pattern": "https://nouveau-europresse-com.bpi.idm.oclc.org/*",
        },
        {
          "name": "Bibliothèque publique d'Ottawa",
          "AUTH_URL": "https://ezproxy.biblioottawalibrary.ca/login?qurl=https://nouveau.eureka.cc/access/ip/default.aspx?un=opladminU_1",
          "pattern": "https://nouveau-eureka-cc.ezproxy.biblioottawalibrary.ca/*",
        },
        {
          "name": "Bibliothèque Sainte-Geneviève (BSG)",
          "AUTH_URL": "http://bsg-ezproxy.univ-paris3.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=pantheonT_1",
          "pattern": "https://nouveau-europresse-com.bsg-ezproxy.univ-paris3.fr/*",
        },      
        {
          "name": "Centrale Lyon",
          "AUTH_URL": "https://ec-lyon.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_7"
        },
        {
          "name": "CY Cergy Paris Université",
          "AUTH_URL": "https://bibdocs.u-cergy.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031547T_1",
          "pattern": "https://nouveau-europresse-com.bibdocs.u-cergy.fr/*",
        },
        {
            "name": "E-SIDOC LFS (Lycée Français de Shanghai)",
            "AUTH_URL": "https://2160010m-cas.esidoc.fr/cas/login?service=http%3a%2f%2fnouveau.europresse.com%2fLogin%2fEsidoc%3fsso_id%3d2160010M",
            "pattern": "https://2160010m-cas.esidoc.fr/*",
        },
        {
          "name": "École Centrale de Lyon (ECL)",
          "AUTH_URL": "https://ec-lyon.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_7"
        },
        {
          "name": "École Centrale de Nantes",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=CENTRALENANTEST_1",
          "pattern": "https://nouveau.europresse.com/access/ip/default.aspx?un=CENTRALENANTEST_1",
        },
        {
          "name": "École Centrale d'Electronique (ECE)",
          "AUTH_URL": "https://go.openathens.net/redirector/omneseducation.com?url=https%3A%2F%2Fnouveau.europresse.com%2Faccess%2Fip%2Fdefault.aspx%3Fun%3DU032932T_1",
          "pattern" : "https://nouveau-europresse-com.proxy.openathens.net/*",
        },
        {
          "name": "École des Hautes Études en Santé Publique (EHESP)",
          "HTTP_REFERER": "https://www.ehesp.fr/",
          "AUTH_URL": "https://login.ehesp.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032196T_1",
          "pattern": "https://nouveau-europresse-com.ehesp.idm.oclc.org/*",
        },
        {
          "name": "École normale supérieure de Lyon (ENS Lyon)",
          "AUTH_URL": "https://acces.bibliotheque-diderot.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ENSLYONT_1",
          "pattern": "https://nouveau-europresse-com.acces.bibliotheque-diderot.fr/*",
        },
        {
          "name": "École normale supérieure de Paris (ENS ULM)",
          "AUTH_URL": "https://proxy.rubens.ens.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1",
          "pattern": "https://nouveau-europresse-com.proxy.rubens.ens.fr/*",
        },
        {
          "name": "École nationale supérieure des sciences de l'information et des bibliothèques (ENSSIB)",
          "AUTH_URL": "http://nouveau.europresse.com.docelec.enssib.fr/access/ip/default.aspx?un=ENSSIBT_1",
          "pattern": "http://nouveau.europresse.com.docelec.enssib.fr/access/ip/default.aspx?un=ENSSIBT_1",
        },
        {
          "name": "École polytechnique",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
          "pattern": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
        },
        {
          "name": "Conservatoire national des arts et métiers",
          "AUTH_URL": "https://proxybib-pp.cnam.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CNAM",
          "pattern": "https://nouveau-europresse-com.proxybib-pp.cnam.fr/*",
        },
        {
          "name": "EM Lyon",
          "AUTH_URL": "https://em-lyon.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=EMLYONT_1",
          "pattern": "https://nouveau-europresse-com.em-lyon.idm.oclc.org/",
        },
        {
          "name": "ENSAM",
          "AUTH_URL": "https://rp1.ensam.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=AML",
          "pattern": "https://nouveau-europresse-com.rp1.ensam.eu/*",
        },
        {
          "name": "ENSTA Bretagne",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=ENSTAT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.ensta-bretagne.fr/*",
        },
        {
          "name": "ENSTA Paris",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_9"
        },
        {
          "name": "ENSAE Paris/ENSAI",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
          "pattern": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
        },
        {
          "name": "ESC Clermont Business School",
          "AUTH_URL": "https://esc-clermont.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ESCT_1",
          "pattern": "https://nouveau-europresse-com.esc-clermont.idm.oclc.org/*",
        },
        {
          "name": "ESCP Business School",
          "AUTH_URL": "https://login.revproxy.escpeurope.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=escpT_1",
          "pattern": "https://nouveau-europresse-com.revproxy.escpeurope.eu/*",
        },
        {
          "name": "ESSEC",
          "AUTH_URL": "https://essec.idm.oclc.org/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ESSECT_1",
          "pattern": "https://nouveau-europresse-com.essec.idm.oclc.org/*",
        },
        {
          "name": "Humathèque Campus Condorcet",
          "AUTH_URL": "https://ezproxy.campus-condorcet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=EPCS",
          "pattern": "https://nouveau-europresse-com.ezproxy.campus-condorcet.fr/*",
        },
        {
          "name": "HEC Paris",
          "AUTH_URL": "http://login.ezproxy.hec.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=josasT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.hec.fr/*",
        },
        {
          "name": "INSA Lyon",
          "AUTH_URL": "https://docelec.insa-lyon.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_3",
          "pattern": "https://nouveau-europresse-com.docelec.insa-lyon.fr/*",
        },
        {
          "name": "École des Ponts ParisTech",
          "AUTH_URL": "https://extranet.enpc.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=umiv",
          "pattern": "https://nouveau-europresse-com.extranet.enpc.fr/*",
        },
        {
          "name": "INSA Rennes",
          "AUTH_URL": "http://rproxy.insa-rennes.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=INSAT_1",
          "pattern": "https://nouveau-europresse-com.rproxy.insa-rennes.fr/*",
        },
        {
          "name" : "La Rochelle Université",
          "AUTH_URL" : "https://gutenberg.univ-lr.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ROCHELLET_1",
          "pattern": "https://nouveau-europresse-com.gutenberg.univ-lr.fr/*",
        },
        {
          "name": "Le Mans Université",
          "AUTH_URL": "https://login.doc-elec.univ-lemans.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031524T_1",
          "pattern": "https://nouveau-europresse-com.doc-elec.univ-lemans.fr/*",
        },
        {
          "name": "Lycée Albert de Mun à Nogent-sur-Marne",
          "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0940880W"
        },
        {
          "name": "Lycée Clemenceau à Nantes",
          "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0440021J"
        },
        {
          "name": "Lycée International de l'Est Parisien",
          "AUTH_URL": "https://nouveau.europresse.com/Login/Esidoc?sso_id=0932638M"
        },
        {
          "name": "Lycée la Martinière Diderot",
          "AUTH_URL": "https://idp-auth.gar.education.fr/domaineGar?idENT=QzAw&idEtab=MDY5MDAzN1I=&idRessource=ark%3A%2F57800%2Feuropresse-cision"
        },
        {
          "name": "Médiathèque de Télécom SudParis & Institut Mines-Télécom Business School",
          "AUTH_URL": "http://mediaproxy.imtbs-tsp.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_8",
          "pattern": "https://nouveau-europresse-com.mediaproxy.imtbs-tsp.eu/*",
        },
        {
          "name": "Rennes School of Business",
          "AUTH_URL": "https://rennes-sb.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=RENNES2T_2",
          "pattern": "https://nouveau-europresse-com.rennes-sb.idm.oclc.org/*",
        },
        {
          "name": "Sciences Po Lyon",
          "AUTH_URL": "http://ressources.sciencespo-lyon.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_5",
          "pattern": "https://nouveau-europresse-com.ressources.sciencespo-lyon.fr/*",
        },
        {
          "name": "Sciences Po Paris",
          "AUTH_URL": "https://catalogue-bibliotheque.sciencespo.fr/view/action/uresolver.do?operation=resolveService&package_service_id=20109524480005808&institutionId=5808&customerId=5800&VE=true",
          "PROXY_URL": "https://nouveau-europresse-com.scpo.idm.oclc.org/*",
          "pattern": "https://nouveau-europresse-com.scpo.idm.oclc.org/*",
        },
        {
          "name": "Télécom Paris",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
          "pattern": "https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1",
        },
        {
          "name": "Université Catholique de Lille",
          "AUTH_URL": "https://login.ezproxy.univ-catholille.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=Vauban2T_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-catholille.fr/*",
        },
        {
          "name": "Université Claude Bernard Lyon 1",
          "AUTH_URL": "http://docelec.univ-lyon1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U033081T_1",
          "pattern": "https://nouveau-europresse-com.docelec.univ-lyon1.fr/*",
        },
        {
          "name": "Université d'Angers",
          "AUTH_URL": "https://buadistant.univ-angers.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUANGERST_1",
          "pattern": "https://nouveau-europresse-com.buadistant.univ-angers.fr/*",
        },
        {
          "name": "Université des Antilles",
          "AUTH_URL": "http://bu-services.univ-antilles.fr:5000/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ANTILLEST_1",
          "pattern": "https://nouveau-europresse-com.bu-services.univ-antilles.fr/*",
        },
        {
          "name": "Université d'Artois",
          "AUTH_URL": "http://ezproxy.univ-artois.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=littoralT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-artois.fr/*",
        },
        {
          "name": "Université d'Avignon",
          "AUTH_URL": "https://buproxy2.univ-avignon.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=AvignonT_1",
          "pattern": "https://nouveau-europresse-com.buproxy2.univ-avignon.fr/*",
        },
        {
          "name": "Université de Bordeaux",
          "AUTH_URL": "https://docelec.u-bordeaux.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVBORDEAUXT_1",
          "pattern": "https://nouveau-europresse-com.docelec.u-bordeaux.fr/*",
        },
        {
          "name": "Université Bordeaux Montaigne",
          "AUTH_URL": "https://ezproxy.u-bordeaux-montaigne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVMONTAIGNET_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.u-bordeaux-montaigne.fr/*",
        },
        {
          "name": "Sciences Po Bordeaux",
          "AUTH_URL": "http://proxy.sciencespobordeaux.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=SCIENCESPOT_1",
          "pattern": "https://nouveau-europresse-com.proxy.sciencespobordeaux.fr/*",
        },
        {
          "name": "Université de Bourgogne",
          "AUTH_URL": "http://proxy-scd.u-bourgogne.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032591T_1",
          "pattern": "https://nouveau-europresse-com.proxy-bu1.u-bourgogne.fr/*",
        },
        {
          "name": "Université de Bretagne Occidentale",
          "AUTH_URL": "http://scd-proxy.univ-brest.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=OCCIDENTALET_1",
          "pattern": "https://nouveau-europresse-com.scd-proxy.univ-brest.fr/*",
        },
        {
          "name": "Université Bretagne Sud",
          "AUTH_URL": "http://ezproxy.univ-ubs.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=BRETAGNESUDT_1",
          "pattern": "https://europresse.ezproxy.univ-ubs.fr/*",
        },
        {
          "name": "Université Catholique de l'Ouest",
          "AUTH_URL": "https://srvext.uco.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UCOT_1",
          "pattern": "https://nouveau-europresse-com.srvext.uco.fr/*",
        },
        {
          "name": "Université de Caen Normandie",
          "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_3",
          "pattern": "https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*",
        },
        {
          "name": "Université Clermont Auvergne",
          "AUTH_URL": "https://ezproxy.uca.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=FERRANDU_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.uca.fr/*",
        },
        {
          "name": "Université Côte d'Azur",
          "AUTH_URL": "http://proxy.unice.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032557T_1",
          "pattern": "https://nouveau-europresse-com.proxy.unice.fr/*",
        },
        {
          "name": "Université d'Évry Val d'Essonne",
          "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_8",
          "pattern": "https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*",
        },
        {
          "name": "Université de Franche-Comté",
          "AUTH_URL": "http://scd1.univ-fcomte.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=FCOMTET_1",
          "pattern": "https://nouveau-europresse-com.scd1.univ-fcomte.fr/*",
        },
        {
          "name": "Université Grenoble-Alpes",
          "AUTH_URL": "https://sid2nomade-2.grenet.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=grenobleT_1",
          "pattern": "https://nouveau-europresse-com.sid2nomade-2.grenet.fr/*",
        },
        {
          "name": "Université Gustave Eiffel",
          "AUTH_URL": "https://univ-eiffel.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000030T_5",
          "pattern": "https://nouveau-europresse-com.univ-eiffel.idm.oclc.org/*",
        },
        {
          "name": "Université Le Havre Normandie",
          "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_6",
          "pattern": "https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*",
        },
        {
          "name": "Université de Haute-Alsace",
          "AUTH_URL": "https://scd-proxy.uha.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ALSACET_1",
          "pattern": "https://nouveau-europresse-com.scd-proxy.uha.fr/*",
        },
        {
          "name": "Université Jean Monnet Saint-Étienne",
          "AUTH_URL": "https://ujm.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MONNETT_1",
          "pattern": "https://nouveau-europresse-com.ujm.idm.oclc.org/*",
        },
        {
          "name": "Université Jean Moulin Lyon 3",
          "AUTH_URL": "http://ezscd.univ-lyon3.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MOULINT_1",
          "pattern": "https://nouveau-europresse-com.ezscd.univ-lyon3.fr/*",
        },
        {
          "name": "Université de la Nouvelle-Calédonie",
          "AUTH_URL": "https://proxy.univ-nc.nc/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CaledonieT_1",
          "pattern": "https://nouveau-europresse-com.proxy.univ-nc.nc/*",
        },
        {
          "name": "Université de La Réunion",
          "AUTH_URL": "https://elgebar.univ-reunion.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUREUNIONT_1",
          "pattern": "https://nouveau.europresse.com.elgebar.univ-reunion.fr/*",
        },
        {
          "name": "Université de Liège",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=U031558T_1"
        },
        {
          "name": "Université Libre de Bruxelles",
          "AUTH_URL": "http://nouveau.europresse.com.ezproxy.ulb.ac.be/access/ip/default.aspx?un=LIBRET_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.ulb.ac.be/*",
        },
        {
          "name": "Université de Lille",
          "AUTH_URL": "https://ressources-electroniques.univ-lille.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=TourcoingT_1",
          "pattern": "https://nouveau-europresse-com.ressources-electroniques.univ-lille.fr/*",
        },
        {
          "name": "Université de Limoges",
          "AUTH_URL": "https://ezproxy.unilim.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031697T_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.unilim.fr/*",
        },
        {
          "name": "Université du Littoral Côte d'Opale (ULCO)",
          "AUTH_URL": "https://ezproxy.univ-littoral.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=dunkerqueT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-littoral.fr/*",
        },
        {
          "name": "Université de Lorraine",
          "AUTH_URL": "https://login.bases-doc.univ-lorraine.fr/login?qurl=http://nouveau.europresse.com/access/ip/default.aspx?un=NANCY2",
          "pattern": "https://nouveau-europresse-com.bases-doc.univ-lorraine.fr/*",
        },
        {
          "name": "Université Lumière Lyon 2",
          "AUTH_URL": "http://bibelec.univ-lyon2.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=LYONT_3",
          "pattern": "https://nouveau-europresse-com.bibelec.univ-lyon2.fr/*",
        },
        {
          "name": "Université de Montpellier",
          "AUTH_URL": "https://login.ezpum.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1",
          "pattern": "https://nouveau-europresse-com.ezpum.scdi-montpellier.fr/*",
        },
        {
          "name": "Nantes Université",
          "AUTH_URL": "https://bunantes.idm.oclc.org/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=NANTEST_1",
          "pattern": "https://nouveau-europresse-com.bunantes.idm.oclc.org/*",
        },
        {
          "name": "Université de Nîmes",
          "AUTH_URL": "https://federation.unimes.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=NimesT_1",
          "pattern": "https://nouveau-europresse-com.federation.unimes.fr/*",
        },
        {
          "name": "Université d'Orléans",
          "AUTH_URL": "https://ezproxy.univ-orleans.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=OrleansT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-orleans.fr/*",
        },
        {
          "name": "Université Paris 1 Panthéon-Sorbonne",
          "AUTH_URL": "https://ezpaarse.univ-paris1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=SORBONNET_1",
          "pattern": "https://nouveau-europresse-com.ezpaarse.univ-paris1.fr/*",
        },
        {
          "name": "Université Paris 2 Panthéon Assas",
          "AUTH_URL": "https://docelec-u-paris2.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ASSAST_1",
          "pattern": "https://nouveau-europresse-com.docelec-u-paris2.idm.oclc.org/*",
        },
        {
          "name": "Université Paris 8",
          "AUTH_URL": "https://accesdistant.bu.univ-paris8.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=paris8",
          "pattern": "https://nouveau-europresse-com.accesdistant.bu.univ-paris8.fr/*",
        },
        {
          "name": "Université Paris Cité",
          "AUTH_URL": "https://ezproxy.u-paris.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UNIVPARIS",
          "pattern": "https://nouveau-europresse-com.ezproxy.u-paris.fr/*",
        },
        {
          "name": "Université Paris-Est Créteil",
          "AUTH_URL": "https://ezproxy.u-pec.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=D000030T_4",
          "pattern": "https://nouveau-europresse-com.ezproxy.u-pec.fr/*",
        },
        {
          "name": "Université Paris Nanterre",
          "AUTH_URL": "http://faraway.parisnanterre.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=Paris10T_1",
          "pattern": "https://nouveau-europresse-com.faraway.parisnanterre.fr/*",
        },
        {
          "name": "Université Paris-Saclay",
          "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9",
          "pattern": "https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*",
        },
        {
          "name": "Université Paris-Saclay (etu)",
          "AUTH_URL": "https://eztest.biblio.univ-evry.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_9",
          "pattern": "https://nouveau-europresse-com.eztest.biblio.univ-evry.fr/*",
        },
        {
          "name": "Université Paul-Valéry Montpellier 3",
          "AUTH_URL": "https://login.ezpupv.scdi-montpellier.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=MontpellierT_1",
          "pattern": "https://nouveau-europresse-com.ezpupv.scdi-montpellier.fr/*",
        },
        {
          "name": "Université de Perpignan",
          "AUTH_URL": "https://ezproxy.univ-perp.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031536T_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-perp.fr/*",
        },
        {
          "name": "Université de Picardie Jules Verne",
          "AUTH_URL": "https://merlin.u-picardie.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUPICARDIET_2",
          "pattern": "https://nouveau-europresse-com.merlin.u-picardie.fr/*",
        },
        {
          "name": "Université PSL",
          "AUTH_URL": "https://portail.psl.eu/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=PSLT_1",
          "pattern": "https://nouveau-europresse-com.portail.psl.eu/*",
        },
        {
          "name": "Université de Pau et des Pays de l'Adour",
          "AUTH_URL": "https://rproxy.univ-pau.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=uppaT_2",
          "pattern": "https://nouveau-europresse-com.rproxy.univ-pau.fr/*",
        },
        {
          "name": "Université de Poitiers",
          "AUTH_URL": "http://ressources.univ-poitiers.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032521T_1",
          "pattern": "https://nouveau-europresse-com.ressources.univ-poitiers.fr/*",
        },
        {
          "name": "Université de la Polynésie Française",
          "AUTH_URL": "http://nouveau.europresse.com.ezproxy.upf.pf/access/ip/default.aspx?un=tahitiT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.upf.pf/*",
        },
        {
          "name": "Université Polytechnique Hauts-de-France",
          "AUTH_URL": "http://ezproxy.uphf.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=valenciennesT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.uphf.fr/*",
        },
        {
          "name": "Université de Reims Champagne-Ardenne",
          "AUTH_URL": "https://urca.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=ArdenneT_1",
          "pattern": "https://nouveau-europresse-com.urca.idm.oclc.org/*",
        },
        {
          "name": "Université de Rennes",
          "AUTH_URL": "https://passerelle.univ-rennes1.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=RENNES1AT_1",
          "pattern": "https://nouveau-europresse-com.passerelle.univ-rennes1.fr/*",
        },
        {
          "name": "Université Rennes 2",
          "AUTH_URL": "https://distant.bu.univ-rennes2.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=RENNES22T_1",
          "pattern": "https://nouveau-europresse-com.distant.bu.univ-rennes2.fr/*",
        },
        {
          "name": "Université de Rouen Normandie",
          "AUTH_URL": "http://ezproxy.normandie-univ.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031221T_4",
          "pattern": "https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*",
        },
        {
          "name": "Université Sorbonne Nouvelle Paris 3",
          "AUTH_URL": "http://ezproxy.univ-paris3.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=pantheonT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-paris3.fr/*",
        },
        {
          "name": "Université Sorbonne Université",
          "AUTH_URL": "https://accesdistant.sorbonne-universite.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UPMCT_1",
          "pattern": "https://nouveau-europresse-com.accesdistant.sorbonne-universite.fr/*",
        },
        {
          "name": "Université Sorbonne Paris Nord - Paris 13",
          "AUTH_URL": "https://login.ezproxy.univ-paris13.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=paris13",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-paris13.fr/*",
        },
        {
          "name": "Université Savoie Mont Blanc",
          "AUTH_URL": "https://univ-smb.idm.oclc.org/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=savoieT_1",
          "pattern": "https://nouveau-europresse-com.univ-smb.idm.oclc.org/*",
        },
        {
          "name": "Université de Technologie de Belfort-Montbéliard",
          "AUTH_URL": "https://ezproxy.utbm.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=UTBMT_2",
          "pattern": "https://nouveau-europresse-com.ezproxy.utbm.fr/*",
        },
        {
          "name": "Université de Technologie de Compiègne",
          "AUTH_URL": "https://ezproxy.utc.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUCOMPIEGNET_2",
          "pattern": "https://nouveau-europresse-com.ezproxy.utc.fr/*",
        },
        {
          "name": "Université de Technologie de Troyes",
          "AUTH_URL": "http://proxy.utt.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=BUTROYEST_2",
          "pattern": "https://nouveau-europresse-com.proxy.utt.fr/*",
        },
        {
          "name": "Université Toulouse 1 Capitole",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_1",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Institut National Universitaire Champollion",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_2",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Institut national des sciences appliquées de Toulouse",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_3",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Ecole nationale de l'aviation civile",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_4",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Université Toulouse Jean Jaurès",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_5",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Université de Toulouse",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_6",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Institut national polytechnique de Toulouse et ENVT",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_7",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Institut supérieur de l'aéronautique et de l'espace",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_8",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Ecole des mines d'Albi-Carmaux",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_9",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Service Interétablissements de Coopération Documentaire",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_13",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Ecole nationale supérieure d'architecture de Toulouse",
          "AUTH_URL": "https://gorgone.univ-toulouse.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_14",
          "pattern": "https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*",
        },
        {
          "name": "Université de Toulon",
          "AUTH_URL": "http://ezproxy.univ-tln.fr:2048/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=ToulonT_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.univ-tln.fr/*",
        },
        {
          "name": "Université de Tours",
          "AUTH_URL": "https://proxy.scd.univ-tours.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=butours",
          "pattern": "https://nouveau-europresse-com.proxy.scd.univ-tours.fr/*",
        },
        {
          "name": "Université de Versailles St-Quentin-en-Yvelines",
          "AUTH_URL": "https://ezproxy.universite-paris-saclay.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=U031535T_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*",
        },
        {
          "name": "University of Cambridge",
          "AUTH_URL": "https://ezp.lib.cam.ac.uk/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U031883T_1",
          "pattern": "https://nouveau-europresse-com.ezp.lib.cam.ac.uk/*",
        },
        { "name": "TBS Education",
          "AUTH_URL": "http://hub.tbs-education.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=CAPITOLET_11ip",
          "pattern": "https://nouveau-europresse-com.hub.tbs-education.fr/*",
        },
        {
          "name": "Toulouse Métropole - MaBM",
          "AUTH_URL": "https://mabm.toulouse-metropole.fr/Portal/ASSARedirect.ashx?url=https://nouveau.europresse.com/access/httpref/default.aspx?un=bmtoulouseAU_1"
        },
        {
          "name": "Métropole de Grenoble - Numothèque",
          "AUTH_URL": "https://numotheque.grenoblealpesmetropole.fr/Default/redirection-contenu-europresse.aspx"
        },
        {
          "name": "VetAgro Sup",
          "AUTH_URL": "https://ezproxy.vetagro-sup.fr/login?url=https://nouveau.europresse.com/access/ip/default.aspx?un=U032869T_1",
          "pattern": "https://nouveau-europresse-com.ezproxy.vetagro-sup.fr/*",
        },
        {
          "name": "UCLouvain",
          "AUTH_URL": "https://nouveau-europresse-com.proxy.bib.uclouvain.be:2443",
          "pattern": "https://nouveau-europresse-com.ezproxy.uclouvain.be/*",
        },
        {
          "name": "E-medi@s Savoie Mont Blanc",
          "AUTH_URL": "https://e-medias.biblio7374.fr/Portal/ASSARedirect.ashx?url=https://nouveau.europresse.com/access/httpref/default.aspx?un=PringyU_2"
        },
        {
          "name": "Science Po Grenoble",
          "AUTH_URL": "http://iepnomade.grenet.fr/login?url=http://nouveau.europresse.com/access/ip/default.aspx?un=IEPT_1",
          "pattern": "https://nouveau-europresse-com.iepnomade-2.grenet.fr/*",
        },
        {
          "name": "ENTPE",
          "AUTH_URL": "https://login.openathens.net/saml/2/sso/entpe.fr/o/81387240/c/proxy.openathens.net?SAMLRequest=jZJRb9owFIX%2FiuX3xI6JSWIRKlY0DanbUEn7sDfjXIqlYGe%2BTlf%2B%2FQIMqZW6qu%2F3nnN0vjO7eTl05BkCWu9qmqWcEnDGt9Y91fSh%2BZqUlGDUrtWdd1BT5%2BnNfIb60PVqMcS9u4ffA2AkC0QIcVS59Q6HA4QNhGdr4OH%2Brqb7GHtUjHX%2Bybq0D%2F7lmPoenI57cJg6iOwkyQTTBhloI4q2hERAO0lyucuTkhd5wrdSm2mb7yZaUrIcXe2ocA7%2B1uB9aUTPwMUe0l1gnpXZpCxEzplh7wWiZLWs6dZk00Ia3mY7k8tWVkIK3kJlSs7LTFbjFeIAK3fqKNZUcCETPkl43nCh5FTJKhVV8YuSdfDRG999se5S7hCc8hotKqcPgCoatVl8v1Mi5Wp7OUL1rWnWyfrnpqHk8QpJnCCN2ByqM4ePpfp%2FvvRCTZ3zhlf%2FH7%2FrK1Y6v3b8f3xjuzYeP8Vvxl6luQ7qx2i%2FWq59Z82RLLrO%2F7kNoOM4u4yy%2BeXl7ezmfwE%3D&RelayState=https%3A%2F%2Fnouveau-europresse-com.proxy.openathens.net%2Faccess%2Fip%2Fdefault.aspx%3Fun%3DENTPET_1",
          "pattern": "https://nouveau-europresse-com.eu1.proxy.openathens.net/*",
        },
        {
          "name": "Bibliothèques du Val d'Oise / RéVOdoc",
          "HTTP_REFERER": "https://revodoc.valdoise.fr/",
          "AUTH_URL": "https://nouveau.europresse.com/access/httpref/default.aspx?un=VALDOISEU_2"
        },
        {
          "name": "Eduvaud",
          "HTTP_REFERER": "https://eduvaud.ch/",
          "AUTH_URL": "https://nouveau.europresse.com/access/ip/default.aspx?un=lausanneAT_1",
          "pattern": "https://nouveau.europresse.com/access/ip/default.aspx?un=lausanneAT_1",
        },
        {
          "name": "Médiathèques d'Antony (92)",
          "HTTP_REFERER": "https://mediatheque.ville-antony.fr/",
          "AUTH_URL": "https://nouveau.europresse.com/access/httpref/default.aspx?un=antonyU_2"
        }
      ]
;

const main = async () => {
    if (window.location.pathname === ("/Login/")) {
        const struct = ophirofoxStruct.filter(entry => entry.pattern).map(entry => ({ ...entry, host: (new URL(entry.pattern)).host }))
        const host = window.location.host;
        const url = monkeyGetSetValue("europresse-forward-to-login-page-url", '');
        const sites = struct.filter(entry => entry.host === host).map(entry => ({name: entry.name, url: entry.AUTH_URL}));
        if (url && url !== '') {
            sites.push({
                name: `Mon site (${url})`,
                url: url
            });
        }
        const returnURls = window.location.search.slice(1).split('&').filter(item=>item.startsWith('ReturnUrl='))
        let suffixUrl = ''
        if (returnURls.length > 0) {
            const returnUrl = decodeURIComponent(returnURls[0].split('=')[1]);
            suffixUrl = `&ReturnUrl=${encodeURIComponent(returnUrl)}`;
        }
        const form = getElements('#loginform')[0];
        if (form) {
            sites.forEach(site => {
                createElementExtended('div', {
                    parent: form,
                    classnames: ['login-button'],
                    children: [
                        createElementExtended('a', {
                            attributes: {
                                href: `${site.url}${suffixUrl}`,
                            },
                            style: {
                                display: 'block',
                            },
                            classnames: ['login-button__btn'],
                            text: `${site.name}`
                        })
                    ],
                });
            });
        }
    }
}

main()