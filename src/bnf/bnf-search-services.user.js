// ==UserScript==
// @description     bnf-search-services : Amélioration de l'ergonomie de la liste base de recherches de la BnF
// @match           https://bdl.bnf.fr/bases-de-donnees-par-titre
// @iconFromDomain  bnf.fr
// ==/UserScript==

// @import{addStyle}
// @import{registerClickListener}
// @import{createElementExtended}
// @import{getSubElements}
// @import{getElements}

addStyle(`
    body { overflow-y: scroll; }
    #page,
    #bnf-search-services-container { height: 40px; }
    #page { position: relative; }
    #bnf-search-services-container { position: fixed; top: 0; left: 0; right: 0; z-index: 23000; background: white; }
    #bnf-search-services-container { display: flex; align-items: center; justify-content: center; gap: 8px; border-bottom: 2px solid #ccc; padding: 0 0; }
    .bnf-search-services-item { display: flex; align-items: center; justify-content: center; }
    .bnf-search-services-hidden { display: none; }

    a.bnf-search-services-search-sur-place,
    a.bnf-search-services-search-distance,
    a.bnf-search-services-search-libre,
    .bnf-search-services-filter-no-details a.bnf-search-services-search-no-details { filter: grayscale(1); opacity: 0.3; }
    .bnf-search-services-filter-sur-place a.bnf-search-services-search-sur-place,
    .bnf-search-services-filter-distance a.bnf-search-services-search-distance,
    .bnf-search-services-filter-libre a.bnf-search-services-search-libre { display: block; filter: grayscale(0); opacity: 1; }
    .bnf-search-services-filter-warns a.bnf-search-services-search-warns { filter: grayscale(0); opacity: 1; }
    .bnf-search-services-filter-no-warns a.bnf-search-services-search-warns { filter: grayscale(1); opacity: 1; }
    .bnf-search-services-filter-any-warns a.bnf-search-services-search-warns { filter: grayscale(0); opacity: 0.3; }
    a.bnf-search-services-search-no-details { filter: grayscale(0); opacity: 1; }
    .bnf-search-services-filter-no-details div.texte,
    .bnf-search-services-filter-no-details div.alerte { display: none; }

    .bnf-search-services-filter-no-details li.document { padding-bottom: 5px; padding-top: 0px; border: 0; }
    .bnf-search-services-filter-no-details li.document a { text-decoration: none; }

    input.bnf-search-services-search-input { padding: 5px 15px; border: 2px solid #ccc; border-radius: 10px; width: 350px; height: 30px;}
    input.bnf-search-services-search-input:focus { box-shadow: none; border: 2px solid #888; }
`);

['.section>a', '#block-filtre-bdd-filtre', '#section-header', '.document .non_interro'].forEach(selector => getElements(selector).forEach(x => x.remove()));

const getSearchString = (data) => data.replaceAll('\n', ' ').replaceAll('\t', ' ').replaceAll('\r', ' ').normalize("NFD").replace(/[\u0300-\u036f]/g, "").replaceAll(/[^a-zA-Z0-9]/g, ' ').replaceAll(/\s+/g, ' ').toLowerCase();

const page = document.getElementById('page');

let counterElement = null;
const filters = {
    sur_place: undefined,
    distance: undefined,
    libre: undefined,
    details: undefined,
    warns: undefined,
    search: '',
}

const documents = getElements('li.document').map((document) => {
    return {
        element: document,
        has_warns: getSubElements(document, '.alerte')?.at(0)?.children?.length > 0,
        is_sur_place: document.classList.contains('acces_sur_place'),
        is_distance: document.classList.contains('acces_distance'),
        is_libre: document.classList.contains('acces_libre'),
        search: getSearchString(document.textContent)
    };
});


documents.forEach((documentData) => {
    if (documentData.has_warns) {
        documentData.element.classList.add('has_warns')
    } else {
        documentData.element.classList.add('has_no_warns')
    }
})


const updateCounter = (value) => {
    if (counterElement) {
        counterElement.textContent = value;
    }
}

const updateDisplay = () => {
    let count = 0;
    documents.forEach((documentData) => {
        let display = true;
        if (!filters.sur_place && documentData.is_sur_place) {
            display = false
        }
        if (!filters.distance && documentData.is_distance) {
            display = false
        }
        if (!filters.libre && documentData.is_libre) {
            display = false
        }

        if (filters.warns === true && documentData.has_warns === false) {
            display = false
        }
        if (filters.warns === false && documentData.has_warns === true) {
            display = false
        }
        if (filters.search && filters.search.length > 0) {
            if (!documentData.search.includes(filters.search)) {
                display = false
            }
        }
        if (display) {
            documentData.element.classList.remove('bnf-search-services-hidden')
            count += 1;
        } else {
            documentData.element.classList.add('bnf-search-services-hidden')
        }
    })
    updateCounter(count);
}

const updateFilters = (filterChanges) => {
    [
        { name: 'sur_place', className: 'bnf-search-services-filter-sur-place', inverted: false },
        { name: 'distance', className: 'bnf-search-services-filter-distance', inverted: false },
        { name: 'libre', className: 'bnf-search-services-filter-libre', inverted: false },
        { name: 'details', className: 'bnf-search-services-filter-no-details', inverted: true },
    ].forEach((filterInfo) => {
        if (filterChanges[filterInfo.name] !== undefined) {
            if (filterChanges[filterInfo.name] !== filters[filterInfo.name]) {
                if (filterChanges[filterInfo.name] && !filterInfo.inverted || !filterChanges[filterInfo.name] && filterInfo.inverted) {
                    document.body.classList.add(filterInfo.className)
                } else {
                    document.body.classList.remove(filterInfo.className)
                }
                filters[filterInfo.name] = filterChanges[filterInfo.name]
            }
        }
    })
    if (filterChanges.warns !== undefined) {
        if (filterChanges.warns !== filters.warns) {
            if (filterChanges.warns === true) {
                document.body.classList.add('bnf-search-services-filter-warns')
                document.body.classList.remove('bnf-search-services-filter-no-warns')
                document.body.classList.remove('bnf-search-services-filter-any-warns')
            } else if (filterChanges.warns === false) {
                document.body.classList.add('bnf-search-services-filter-no-warns')
                document.body.classList.remove('bnf-search-services-filter-warns')
                document.body.classList.remove('bnf-search-services-filter-any-warns')
            } else {
                document.body.classList.add('bnf-search-services-filter-any-warns')
                document.body.classList.remove('bnf-search-services-filter-warns')
                document.body.classList.remove('bnf-search-services-filter-no-warns')
            }
            filters.warns = filterChanges.warns
        }
    }
    updateDisplay();
}

const updateSearch_ = (searchString) => {
    filters.search = getSearchString(searchString);
    updateDisplay();
}

const createLocationFilterElement = (suffixClassname, description, filterName) => createElementExtended('a', {
    classnames: [
        'bnf-search-services-item',
        `bnf-search-services-search-${suffixClassname}`,
    ],
    attributes: {
        href: '#',
    },
    children: [
        createElementExtended('img', {
            attributes: {
                src: `/sites/all/themes/bddreselec_omega/css/images/picto_acces_${filterName}.gif`,
                alt: description,
                title: description,
            },
            onCreated: (element) => {
                registerClickListener(element, () => {
                    console.log(`Image clicked: ${description} - ${filterName}`);
                    updateFilters({ [filterName]: !filters[filterName] })
                })
            },
        }),
    ]
})

const createEmojiFilterElement = (suffixClassname, description, emoji, onClick) => createElementExtended('a', {
    classnames: [
        'bnf-search-services-item',
        `bnf-search-services-search-${suffixClassname}`,
    ],
    attributes: {
        href: '#',
    },
    children: [
        createElementExtended('span', {
            attributes: {
                alt: description,
                title: description,
            },
            style: {
                fontSize: '20px',
                lineHeight: '20px',
                marginTop: '-2px',
            },
            text: emoji,
            onCreated: (element) => {
                registerClickListener(element, () => {
                    console.log(`Image clicked: ${description}`);
                    onClick()
                })
            },
        }),
    ]
})

const createSearchFilterElement = () => createElementExtended('input', {
    classnames: [
        'bnf-search-services-item',
        `bnf-search-services-search-input`,
    ],
    attributes: {
        type: 'text',
        placeholder: 'Rechercher...',
    },
    onCreated: (element) => {
        registerEventListener(element, 'input', (e) => {
            updateSearch_(e.target.value);
        })
        setTimeout(() => {
            element.focus()
        }, 0);

    },
})

const createWarnsFilterElement = (suffixClassname, description) => createEmojiFilterElement(suffixClassname, description, '⚠️', () => {
    let warns = null;
    if (filters.warns === null) {
        warns = true;
    } else if (filters.warns === true) {
        warns = false;
    }

    updateFilters({ warns })
})

const createDetailsFilterElement = (suffixClassname, description) => createEmojiFilterElement(suffixClassname, description, '📜', () => {
    updateFilters({ details: !filters.details })
})

const container = createElementExtended('div', {
    parent: page,
    id: 'bnf-search-services-container',
    children: [
        createElementExtended('span', {
            style: {
                width: '20px',
            },
            onCreated: (element) => {
                counterElement = element;
            },
        }),
        createLocationFilterElement('sur-place', 'Cette base est uniquement accessible à la BnF.', 'sur_place'),
        createLocationFilterElement('distance', 'Ressource accessible à distance pour les détenteurs d’un Pass Recherche illimité ou d’un Pass  BnF Lecture/Culture.', 'distance'),
        createLocationFilterElement('libre', 'Ressource en accès libre sur Internet.', 'libre'),
        createWarnsFilterElement('warns', 'Filtrer les ressources avec alertes'),
        createDetailsFilterElement('no-details', 'Afficher/Masquer les détails des ressources'),
        createSearchFilterElement(),
    ],
})


updateFilters({
    sur_place: true,
    distance: true,
    libre: true,
    warns: null,
    details: false,
})
