// ==UserScript==
// @name        europresse-autofill-last-year-for-archive-search
// @namespace   https://github.com/gissehel/userscripts
// @version     20260205-162358-f91f16a
// @description europresse-autofill-last-year-for-archive-search
// @author      gissehel
// @homepage    https://github.com/gissehel/userscripts
// @supportURL  https://github.com/gissehel/userscripts/issues
// @match       http://nouveau.europresse.com.docelec.enssib.fr/access/ip/default.aspx?un=ENSSIBT_1
// @match       https://2160010m-cas.esidoc.fr/*
// @match       https://europresse.ezproxy.univ-ubs.fr/*
// @match       https://nouveau-eureka-cc.ezproxy.biblioottawalibrary.ca/*
// @match       https://nouveau-eureka-cc.res.banq.qc.ca/*
// @match       https://nouveau-europresse-com.acces-distant.bnu.fr/*
// @match       https://nouveau-europresse-com.acces.bibliotheque-diderot.fr/*
// @match       https://nouveau-europresse-com.accesdistant.bu.univ-paris8.fr/*
// @match       https://nouveau-europresse-com.accesdistant.sorbonne-universite.fr/*
// @match       https://nouveau-europresse-com.bases-doc.univ-lorraine.fr/*
// @match       https://nouveau-europresse-com.bibdocs.u-cergy.fr/*
// @match       https://nouveau-europresse-com.bibelec.univ-lyon2.fr/*
// @match       https://nouveau-europresse-com.bnf.idm.oclc.org/*
// @match       https://nouveau-europresse-com.bpi.idm.oclc.org/*
// @match       https://nouveau-europresse-com.bsg-ezproxy.univ-paris3.fr/*
// @match       https://nouveau-europresse-com.bu-services.univ-antilles.fr/*
// @match       https://nouveau-europresse-com.buadistant.univ-angers.fr/*
// @match       https://nouveau-europresse-com.bunantes.idm.oclc.org/*
// @match       https://nouveau-europresse-com.buproxy2.univ-avignon.fr/*
// @match       https://nouveau-europresse-com.distant.bu.univ-rennes2.fr/*
// @match       https://nouveau-europresse-com.doc-elec.univ-lemans.fr/*
// @match       https://nouveau-europresse-com.docelec-u-paris2.idm.oclc.org/*
// @match       https://nouveau-europresse-com.docelec.insa-lyon.fr/*
// @match       https://nouveau-europresse-com.docelec.u-bordeaux.fr/*
// @match       https://nouveau-europresse-com.docelec.univ-lyon1.fr/*
// @match       https://nouveau-europresse-com.ehesp.idm.oclc.org/*
// @match       https://nouveau-europresse-com.em-lyon.idm.oclc.org/
// @match       https://nouveau-europresse-com.esc-clermont.idm.oclc.org/*
// @match       https://nouveau-europresse-com.essec.idm.oclc.org/*
// @match       https://nouveau-europresse-com.eu1.proxy.openathens.net/*
// @match       https://nouveau-europresse-com.extranet.enpc.fr/*
// @match       https://nouveau-europresse-com.ezp.lib.cam.ac.uk/*
// @match       https://nouveau-europresse-com.ezpaarse.univ-paris1.fr/*
// @match       https://nouveau-europresse-com.ezproxy.campus-condorcet.fr/*
// @match       https://nouveau-europresse-com.ezproxy.ensta-bretagne.fr/*
// @match       https://nouveau-europresse-com.ezproxy.hec.fr/*
// @match       https://nouveau-europresse-com.ezproxy.normandie-univ.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-bordeaux-montaigne.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-paris.fr/*
// @match       https://nouveau-europresse-com.ezproxy.u-pec.fr/*
// @match       https://nouveau-europresse-com.ezproxy.uca.fr/*
// @match       https://nouveau-europresse-com.ezproxy.uclouvain.be/*
// @match       https://nouveau-europresse-com.ezproxy.ulb.ac.be/*
// @match       https://nouveau-europresse-com.ezproxy.unilim.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-artois.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-catholille.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-littoral.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-orleans.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-paris13.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-paris3.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-perp.fr/*
// @match       https://nouveau-europresse-com.ezproxy.univ-tln.fr/*
// @match       https://nouveau-europresse-com.ezproxy.universite-paris-saclay.fr/*
// @match       https://nouveau-europresse-com.ezproxy.upf.pf/*
// @match       https://nouveau-europresse-com.ezproxy.uphf.fr/*
// @match       https://nouveau-europresse-com.ezproxy.utbm.fr/*
// @match       https://nouveau-europresse-com.ezproxy.utc.fr/*
// @match       https://nouveau-europresse-com.ezproxy.vetagro-sup.fr/*
// @match       https://nouveau-europresse-com.ezpum.scdi-montpellier.fr/*
// @match       https://nouveau-europresse-com.ezpupv.scdi-montpellier.fr/*
// @match       https://nouveau-europresse-com.ezscd.univ-lyon3.fr/*
// @match       https://nouveau-europresse-com.eztest.biblio.univ-evry.fr/*
// @match       https://nouveau-europresse-com.faraway.parisnanterre.fr/*
// @match       https://nouveau-europresse-com.federation.unimes.fr/*
// @match       https://nouveau-europresse-com.gorgone.univ-toulouse.fr/*
// @match       https://nouveau-europresse-com.gutenberg.univ-lr.fr/*
// @match       https://nouveau-europresse-com.hub.tbs-education.fr/*
// @match       https://nouveau-europresse-com.iepnomade-2.grenet.fr/*
// @match       https://nouveau-europresse-com.lama.univ-amu.fr/*
// @match       https://nouveau-europresse-com.mediaproxy.imtbs-tsp.eu/*
// @match       https://nouveau-europresse-com.merlin.u-picardie.fr/*
// @match       https://nouveau-europresse-com.passerelle.univ-rennes1.fr/*
// @match       https://nouveau-europresse-com.portail.psl.eu/*
// @match       https://nouveau-europresse-com.proxy-bu1.u-bourgogne.fr/*
// @match       https://nouveau-europresse-com.proxy.bnl.lu/*
// @match       https://nouveau-europresse-com.proxy.openathens.net/*
// @match       https://nouveau-europresse-com.proxy.rubens.ens.fr/*
// @match       https://nouveau-europresse-com.proxy.scd.univ-tours.fr/*
// @match       https://nouveau-europresse-com.proxy.sciencespobordeaux.fr/*
// @match       https://nouveau-europresse-com.proxy.unice.fr/*
// @match       https://nouveau-europresse-com.proxy.univ-nc.nc/*
// @match       https://nouveau-europresse-com.proxy.utt.fr/*
// @match       https://nouveau-europresse-com.proxybib-pp.cnam.fr/*
// @match       https://nouveau-europresse-com.rennes-sb.idm.oclc.org/*
// @match       https://nouveau-europresse-com.ressources-electroniques.univ-lille.fr/*
// @match       https://nouveau-europresse-com.ressources.sciencespo-lyon.fr/*
// @match       https://nouveau-europresse-com.ressources.univ-poitiers.fr/*
// @match       https://nouveau-europresse-com.revproxy.escpeurope.eu/*
// @match       https://nouveau-europresse-com.rp1.ensam.eu/*
// @match       https://nouveau-europresse-com.rproxy.insa-rennes.fr/*
// @match       https://nouveau-europresse-com.rproxy.univ-pau.fr/*
// @match       https://nouveau-europresse-com.scd-proxy.uha.fr/*
// @match       https://nouveau-europresse-com.scd-proxy.univ-brest.fr/*
// @match       https://nouveau-europresse-com.scd1.univ-fcomte.fr/*
// @match       https://nouveau-europresse-com.scpo.idm.oclc.org/*
// @match       https://nouveau-europresse-com.sid2nomade-2.grenet.fr/*
// @match       https://nouveau-europresse-com.srvext.uco.fr/*
// @match       https://nouveau-europresse-com.ujm.idm.oclc.org/*
// @match       https://nouveau-europresse-com.univ-eiffel.idm.oclc.org/*
// @match       https://nouveau-europresse-com.univ-smb.idm.oclc.org/*
// @match       https://nouveau-europresse-com.urca.idm.oclc.org/*
// @match       https://nouveau.europresse.com.elgebar.univ-reunion.fr/*
// @match       https://nouveau.europresse.com/*
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=CENTRALENANTEST_1
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=U033137T_1
// @match       https://nouveau.europresse.com/access/ip/default.aspx?un=lausanneAT_1
// @icon        https://www.google.com/s2/favicons?sz=64&domain=nouveau.europresse.com
// @grant       none
// ==/UserScript==

const script_name = GM_info?.script?.name || 'no-name'
const script_version = GM_info?.script?.version || 'no-version'
const script_id = `${script_name} ${script_version}`
console.log(`Begin - ${script_id}`)


// @main_begin{europresse-autofill-last-year-for-archive-search}
if (window.location.pathname === '/PDF/ArchiveResult') {
    const fromField = document.querySelectorAll('#pdfSeachFrom')[0]
    const toField = document.querySelectorAll('#pdfSeachTo')[0]

    if (fromField && toField) {
        const today = new Date();
        const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        const todayIso = today.toISOString().split('T')[0];
        const oneYearAgoIso = oneYearAgo.toISOString().split('T')[0];
        fromField.value = oneYearAgoIso;
        toField.value = todayIso;
    }
}
// @main_end{europresse-autofill-last-year-for-archive-search}

console.log(`End - ${script_id}`)
