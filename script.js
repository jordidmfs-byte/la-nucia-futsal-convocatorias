// Immediate execution cleanup on file load
(function autoCleanHistoryOnLoad() {
    try {
        localStorage.removeItem('laNuciaFS_drafts');
        const deletedStr = localStorage.getItem('laNuciaFS_deletedHistoryIds');
        let deleted = deletedStr ? JSON.parse(deletedStr) : [];
        if (!Array.isArray(deleted)) deleted = [];
        if (!deleted.includes('1787641678059')) deleted.push('1787641678059');
        localStorage.setItem('laNuciaFS_deletedHistoryIds', JSON.stringify(deleted));

        const historyStr = localStorage.getItem('laNuciaFS_history');
        if (historyStr) {
            let hist = JSON.parse(historyStr);
            if (Array.isArray(hist)) {
                const cleaned = hist.filter(h => {
                    if (!h) return false;
                    const idStr = String(h.id || '');
                    if (deleted.includes(idStr)) return false;
                    const combined = (String(h.rival || '') + ' ' + String(h.jornada || '')).toLowerCase();
                    if (combined.includes('manresa') || combined.includes('covisa')) {
                        if (idStr && !deleted.includes(idStr)) deleted.push(idStr);
                        return false;
                    }
                    return true;
                });
                localStorage.setItem('laNuciaFS_history', JSON.stringify(cleaned));
                localStorage.setItem('laNuciaFS_deletedHistoryIds', JSON.stringify(deleted));
            }
        }
    } catch (e) {}
})();

// Database of Players for La Nucía FS
const FIRST_TEAM_PLAYERS = [
    { id: '1-99', number: 99, name: 'Iván Cantó Reig', position: 'Portero', isGoalkeeper: true },
    { id: '1-88', number: 88, name: 'Josep Andreu García Rodríguez', position: 'Portero', isGoalkeeper: true },
    { id: '1-11', number: 11, name: 'Abel Fernández Romero', position: 'Cierre', isGoalkeeper: false },
    { id: '1-10', number: 10, name: 'Jorge Fernández Esteve', position: 'Cierre', isGoalkeeper: false },
    { id: '1-98', number: 98, name: 'Jose Miralles Ríos', position: 'Ala zurdo', isGoalkeeper: false },
    { id: '1-20', number: 20, name: 'Angel Trobo Pérez', position: 'Ala diestro', isGoalkeeper: false },
    { id: '1-4', number: 4, name: 'Raul González Yuste', position: 'Ala/Pivot diestro', isGoalkeeper: false },
    { id: '1-9', number: 9, name: 'Rachad Madi', position: 'Ala/Cierre zurdo', isGoalkeeper: false },
    { id: '1-23', number: 23, name: 'Alejandro Espinosa Sabater', position: 'Ala pivot zurdo', isGoalkeeper: false },
    { id: '1-7', number: 7, name: 'Manu Garcia Ruano', position: 'Ala diestro', isGoalkeeper: false },
    { id: '1-8', number: 8, name: 'Sergio Lago Mayorga', position: 'Ala zurdo', isGoalkeeper: false },
    { id: '1-21', number: 21, name: 'Julian De Diego García', position: 'Pivot zurdo', isGoalkeeper: false },
    { id: '1-alcayde', number: '', name: 'Manuel Alcayde', position: 'Ala diestro', isGoalkeeper: false },
    { id: '1-franz-monzo', number: '', name: 'Franz Esteban Monzo Cáceres', position: 'Ala zurdo', isGoalkeeper: false }
];

const FILIAL_TEAM_PLAYERS = [
    { id: 'f-13', number: 13, name: 'Hector Valero Rubio', position: 'Portero', isGoalkeeper: true },
    { id: 'f-12', number: 12, name: 'Mario Daniel Padilla Reyes', position: 'Portero', isGoalkeeper: true },
    { id: 'f-jlhr', number: '', name: 'Jose Luis Heredia Ruiz', position: 'Portero', isGoalkeeper: true },
    { id: 'f-daa', number: '', name: 'Diego Agustin Aguilar', position: 'Portero', isGoalkeeper: true },
    { id: 'f-23', number: 23, name: 'Sergio Juarez Sanchez', position: 'Cierre', isGoalkeeper: false },
    { id: 'f-10', number: 10, name: 'Joan Manuel Misa Giarrusso', position: 'Cierre', isGoalkeeper: false },
    { id: 'f-36', number: 36, name: 'Alejandro Gomez Sola', position: 'Cierre', isGoalkeeper: false },
    { id: 'f-lafl', number: '', name: 'Luis Alejandro Flores Loja', position: 'Sin posición', isGoalkeeper: false },
    { id: 'f-34-m', number: 34, name: 'Alberto Madagascar Casanova', position: 'Cierre', isGoalkeeper: false },
    { id: 'f-11', number: 11, name: 'Antonio Cortes Ruiz', position: 'Ala', isGoalkeeper: false },
    { id: 'f-42', number: 42, name: 'Alvaro Roma Suarez', position: 'Ala', isGoalkeeper: false },
    { id: 'f-16', number: 16, name: 'Franz Esteban Monzon Caceres', position: 'Ala', isGoalkeeper: false },
    { id: 'f-slm', number: '', name: 'Sergio Lago Mayorga', position: 'Ala zurdo', isGoalkeeper: false },
    { id: 'f-jlrbh', number: '', name: 'Jose Luis Ruiz Ben Hamu', position: 'Sin posición', isGoalkeeper: false },
    { id: 'f-atp', number: '', name: 'Angel Trobo Perez', position: 'Ala diestro', isGoalkeeper: false },
    { id: 'f-wj', number: '', name: 'Wilker Jimenez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'f-jc', number: '', name: 'Jose Cordova', position: 'Sin posición', isGoalkeeper: false },
    { id: 'f-7', number: 7, name: 'Victor Manzaneda Gadea', position: 'Pivot', isGoalkeeper: false },
    { id: 'f-6', number: 6, name: 'Demetrio Pozo Fernandez', position: 'Pivot', isGoalkeeper: false },
    { id: 'f-ejbr', number: '', name: 'Eduardo José Boye Ricardo', position: 'Sin posición', isGoalkeeper: false },
    { id: 'f-2', number: 2, name: 'Ibrahim Gaye Gaye', position: 'Pivot', isGoalkeeper: false },
    { id: 'f-rpa', number: '', name: 'Raul Perles Ausias', position: 'Sin posición', isGoalkeeper: false }
];

const JUVENIL_TEAM_PLAYERS = [
    { id: 'j-maml', number: '', name: 'Miguel Ángel Medina Lledó', position: 'Portero', isGoalkeeper: true },
    { id: 'j-rzb', number: '', name: 'Raul Zaragoza Blasco', position: 'Portero', isGoalkeeper: true },
    { id: 'j-src', number: '', name: 'Sebastián Ramírez Caballero', position: 'Portero', isGoalkeeper: true },
    { id: 'j-avm', number: '', name: 'Angel Vargas Manzano', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-nma', number: '', name: 'Néstor Mesa Andreo', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-mpp', number: '', name: 'Marcos Pees Pérez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-nsb', number: '', name: 'Nicolás Serrano Baides', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-arl', number: '', name: 'Aaron Robledillo Lozano', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-ots', number: '', name: 'Óscar Triguero Sánchez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-jjpr', number: '', name: 'Juan Jose Parra Rojas', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-sme', number: '', name: 'Siam Monserrat Escobar', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-jsa', number: '', name: 'Jordi Serra Antolí', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-kf', number: '', name: 'Kelvin Fernandez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-jp', number: '', name: 'José Perez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-fs', number: '', name: 'Francesc Soriano', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-asg', number: '', name: 'Adrián Sanchis Garrido', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-ifc', number: '', name: 'Iker Fernandez Casellas', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-pvf', number: '', name: 'Pablo Vaello Fernandez', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-pmb', number: '', name: 'Pablo Martin Botia', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-msd', number: '', name: 'Marc Saval Dueñas', position: 'Sin posición', isGoalkeeper: false },
    { id: 'j-djg', number: '', name: 'Daniel Jose Galindez', position: 'Sin posición', isGoalkeeper: false }
];

const FILIAL_OPPONENTS = [
    'Sp. San Vicente - Hércules F.S. "B"',
    'C.F.S. Dianense "A"',
    'Alonis Villajoyosa Futsal C.D. "A"',
    'Serelles Alcoy C.F.S. "B"',
    'R.C. Dinamita-Albatera F.S. "B"',
    'C.F.S. Futsal Ibi "B"',
    'C.D. At. Torrevieja F.S.',
    'C.F.S. Mirrense "A"',
    'C.F.S. San Blas Sax "A"',
    'U.D. La Hoya de Elche C.F. "A"',
    'Ye Faky F.S. "B"',
    'Club Mutxamel Benifutsal "A"',
    'C.D. Salesianos Villena'
];

const JUVENIL_OPPONENTS = [
    'Alboraya F.S. "A"',
    'C.D. Santo Tomás de Villanueva "A"',
    'C.D. Paidos Dénia "A"',
    'C.F.S. At. Moncadense "A"',
    'C.F.S. Castalla',
    'C.F.S. Riba-Roja "A"',
    'F.S.F. Joventut d\'Elx "A"',
    'Maristas Cullera',
    'Novelda C.F. "A"',
    'Nueva Elda F.S. "B"',
    'Pinoso Atlethic F.S. "A"',
    'S.D. Col. El Pilar Valencia de la FEMDL "B"',
    'Valencia F.S. "A"'
];

// Authentication
const PASS_ADMIN = 'lanucia';
const PASS_RESTRICTED = 'filial';
let userRole = null; // 'admin' or 'restricted'

// Active State
let currentTeam = 'primer-equipo'; // 'primer-equipo' or 'filial' or 'juvenil'
let squadState = []; 

function getPositionOrder(pos) {
    if (!pos) return 5;
    const p = pos.toLowerCase();
    if (p.includes('portero')) return 1;
    if (p.includes('cierre')) return 2;
    if (p.includes('ala')) return 3;
    if (p.includes('pivot')) return 4;
    return 5;
}

// Calendar for Primer Equipo: Club Deportivo Sporting La Nucía - Segunda División B Grupo 3 (2026/2027)
// (local: true = jugamos en CASA 'vs', local: false = jugamos FUERA '@')
const PRIMER_EQUIPO_CALENDAR = [
    { jornada: 1,  fecha: '2026-09-19', rival: 'Covisa Manresa',                                     local: false },
    { jornada: 2,  fecha: '2026-09-26', rival: 'A.E. Llevant De Manacor Futsal "A"',                 local: true  },
    { jornada: 3,  fecha: '2026-10-03', rival: 'Les Corts EF "A"',                                   local: false },
    { jornada: 4,  fecha: '2026-10-10', rival: 'Hospitalet Bellsport F.S.',                          local: true  },
    { jornada: 5,  fecha: '2026-10-17', rival: 'C. Natació Sabadell',                                local: false },
    { jornada: 6,  fecha: '2026-10-24', rival: 'C.F.S. Futsal IBI - Juypal Hogar',                  local: true  },
    { jornada: 7,  fecha: '2026-10-31', rival: 'Canet F.S.',                                         local: false },
    { jornada: 8,  fecha: '2026-11-07', rival: 'Nunsys El Pilar',                                    local: true  },
    { jornada: 9,  fecha: '2026-11-14', rival: 'F.S. Picassent',                                     local: true  },
    { jornada: 10, fecha: '2026-11-21', rival: 'F.S. Ripollet "A"',                                  local: false },
    { jornada: 11, fecha: '2026-11-28', rival: 'Ye Faky F.S.',                                       local: true  },
    { jornada: 12, fecha: '2026-12-05', rival: 'Illes Balears Palma Futsal',                         local: false },
    { jornada: 13, fecha: '2026-12-12', rival: 'Sant Joan Despí Futbol Sala 20 "A"',                 local: true  },
    { jornada: 14, fecha: '2026-12-19', rival: 'Col. Santo Ángel/Ccr-Baixsud de Castelldefels A',   local: false },
    { jornada: 15, fecha: '2027-01-09', rival: 'Catgas Energía Santa Coloma',                        local: true  },
    { jornada: 16, fecha: '2027-01-16', rival: 'Covisa Manresa',                                     local: true  },
    { jornada: 17, fecha: '2027-01-23', rival: 'A.E. Llevant De Manacor Futsal "A"',                local: false },
    { jornada: 18, fecha: '2027-01-30', rival: 'Les Corts EF "A"',                                   local: true  },
    { jornada: 19, fecha: '2027-02-06', rival: 'Hospitalet Bellsport F.S.',                          local: false },
    { jornada: 20, fecha: '2027-02-13', rival: 'C. Natació Sabadell',                                local: true  },
    { jornada: 21, fecha: '2027-02-20', rival: 'C.F.S. Futsal IBI - Juypal Hogar',                  local: false },
    { jornada: 22, fecha: '2027-02-27', rival: 'Canet F.S.',                                         local: true  },
    { jornada: 23, fecha: '2027-03-06', rival: 'Nunsys El Pilar',                                    local: false },
    { jornada: 24, fecha: '2027-03-20', rival: 'F.S. Picassent',                                     local: false },
    { jornada: 25, fecha: '2027-04-03', rival: 'F.S. Ripollet "A"',                                  local: true  },
    { jornada: 26, fecha: '2027-04-10', rival: 'Ye Faky F.S.',                                       local: false },
    { jornada: 27, fecha: '2027-04-17', rival: 'Illes Balears Palma Futsal',                         local: true  },
    { jornada: 28, fecha: '2027-04-24', rival: 'Sant Joan Despí Futbol Sala 20 "A"',                 local: false },
    { jornada: 29, fecha: '2027-05-01', rival: 'Col. Santo Ángel/Ccr-Baixsud de Castelldefels A',   local: true  },
    { jornada: 30, fecha: '2027-05-08', rival: 'Catgas Energía Santa Coloma',                        local: false },
];

function populateJornadaDropdown(team = currentTeam) {
    const select = document.getElementById('input-jornada');
    if (!select) return;
    select.innerHTML = '';
    
    // Opción por defecto vacía para empezar siempre limpio
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.text = '-- Seleccionar Jornada --';
    defaultOpt.selected = true;
    select.appendChild(defaultOpt);

    const maxJornadas = (team === 'primer-equipo') ? 30 : 26;
    for (let i = 1; i <= maxJornadas; i++) {
        const option = document.createElement('option');
        option.value = i.toString();
        if (team === 'primer-equipo') {
            const cal = PRIMER_EQUIPO_CALENDAR.find(c => c.jornada === i);
            option.text = cal
                ? `J${i} - ${cal.local ? 'vs' : '@'} ${cal.rival}`
                : `Jornada ${i}`;
        } else {
            option.text = `Jornada ${i}`;
        }
        select.appendChild(option);
    }
    
    // Opciones especiales: Supercopa (Primer Equipo) y Amistoso (Primer Equipo, Filial y Juvenil)
    if (team === 'primer-equipo') {
        const optSupercopa = document.createElement('option');
        optSupercopa.value = 'Supercopa';
        optSupercopa.text = 'Supercopa';
        select.appendChild(optSupercopa);
    }
    
    const optAmistoso = document.createElement('option');
    optAmistoso.value = 'Amistoso';
    optAmistoso.text = 'Amistoso';
    select.appendChild(optAmistoso);

    select.value = '';
}

// Load Initial Data
function initApp() {
    localStorage.removeItem('laNuciaFS_drafts');
    loadTeamData(currentTeam);
    setupEventListeners();
    setupSpeechRecognition();
    startRealtimeSync();
}

// Load team players and set default call-up states based on requirements
function getCustomPositions() {
    const saved = localStorage.getItem('laNuciaFS_customPositions');
    return saved ? JSON.parse(saved) : {};
}

function saveCustomPosition(playerId, position) {
    const custom = getCustomPositions();
    custom[playerId] = position;
    localStorage.setItem('laNuciaFS_customPositions', JSON.stringify(custom));
    pushCloudData();
}

// Helper to calculate call-up time 1h 15m (75 minutes) before match schedule
function calculateCallupTime(matchDateTimeStr) {
    if (!matchDateTimeStr) return '';
    try {
        const d = new Date(matchDateTimeStr);
        if (isNaN(d.getTime())) return '';
        d.setMinutes(d.getMinutes() - 75);
        const hh = String(d.getHours()).padStart(2, '0');
        const mm = String(d.getMinutes()).padStart(2, '0');
        return `${hh}:${mm}`;
    } catch (e) {
        return '';
    }
}

function loadTeamData(team) {
    squadState = [];
    const customPositions = getCustomPositions();
    
    // Configurar desplegable de jornadas
    populateJornadaDropdown(team);
    
    // Poblar datalist de rivales con rivales extra añadidos
    const rivalDatalist = document.getElementById('rival-datalist');
    if (rivalDatalist) {
        rivalDatalist.innerHTML = '';
        let opponents = [];
        const extraRivals = ['Futsal Ibi', 'Elche 2012', 'Nueva Elda'];
        if (team === 'primer-equipo') {
            opponents = Array.from(new Set([...PRIMER_EQUIPO_CALENDAR.map(c => c.rival), ...extraRivals]));
        } else if (team === 'filial') {
            opponents = Array.from(new Set([...FILIAL_OPPONENTS, ...extraRivals]));
        } else if (team === 'juvenil') {
            opponents = Array.from(new Set([...JUVENIL_OPPONENTS, ...extraRivals]));
        }
        
        opponents.sort().forEach(opp => {
            const opt = document.createElement('option');
            opt.value = opp;
            rivalDatalist.appendChild(opt);
        });
    }

    // Inicializar siempre limpio para rellenar todos los campos
    const inputJornada = document.getElementById('input-jornada');
    if (inputJornada && inputJornada.options.length > 0) inputJornada.selectedIndex = 0;
    if (document.getElementById('input-rival')) document.getElementById('input-rival').value = '';
    if (document.getElementById('input-venue')) document.getElementById('input-venue').value = 'Pabellón Camilo Cano';
    if (document.getElementById('input-schedule')) document.getElementById('input-schedule').value = '';
    if (document.getElementById('input-callup-time')) document.getElementById('input-callup-time').value = '';
    if (document.getElementById('input-kit')) document.getElementById('input-kit').value = 'Primera Equipación';
    if (document.getElementById('input-observations')) document.getElementById('input-observations').value = '';
    if (document.getElementById('input-guest-search')) document.getElementById('input-guest-search').value = '';

    if (team === 'primer-equipo') {
        if (document.getElementById('input-coach')) document.getElementById('input-coach').value = 'David Valverde Bonastre';
        FIRST_TEAM_PLAYERS.forEach(player => {
            squadState.push({
                ...player,
                position: customPositions[player.id] || player.position,
                isCalled: true,
                reason: '',
                isGuest: false
            });
        });
        
        const searchContainer = document.getElementById('guest-search-container');
        if (searchContainer) searchContainer.style.display = 'flex';
        const searchLabel = document.getElementById('label-guest-search');
        if (searchLabel) searchLabel.innerText = 'Añadir Jugador (Filial o Juvenil)';
        populateGuestDropdownToAdd();
    } else if (team === 'filial') {
        if (document.getElementById('input-coach')) document.getElementById('input-coach').value = 'Jona';
        FILIAL_TEAM_PLAYERS.forEach(player => {
            squadState.push({
                ...player,
                position: customPositions[player.id] || player.position,
                isCalled: true,
                reason: '',
                isGuest: false
            });
        });
        
        const searchContainer = document.getElementById('guest-search-container');
        if (searchContainer) searchContainer.style.display = 'flex';
        const searchLabel = document.getElementById('label-guest-search');
        if (searchLabel) searchLabel.innerText = 'Añadir Jugador (Juvenil)';
        populateGuestDropdownToAdd();
    } else if (team === 'juvenil') {
        if (document.getElementById('input-coach')) document.getElementById('input-coach').value = 'Entrenador Juvenil';
        JUVENIL_TEAM_PLAYERS.forEach(player => {
            squadState.push({
                ...player,
                position: customPositions[player.id] || player.position,
                isCalled: true,
                reason: '',
                isGuest: false
            });
        });
        
        const searchContainer = document.getElementById('guest-search-container');
        if (searchContainer) searchContainer.style.display = 'none';
    }

    renderPlayerList();
    updateTacticalView();

    // Plan de Viaje (Solo Primer Equipo)
    const planViajeCard = document.getElementById('plan-viaje-card');
    if (planViajeCard) {
        planViajeCard.style.display = (team === 'primer-equipo') ? 'block' : 'none';
    }
    if (team === 'primer-equipo') {
        updatePlanViajeUI();
    }
}

// Populate the datalist to add guest players
function populateGuestDropdownToAdd() {
    const datalist = document.getElementById('guest-datalist');
    if (!datalist) return;
    datalist.innerHTML = '';
    
    let availablePlayers = [];
    if (currentTeam === 'primer-equipo') {
        availablePlayers = [...FILIAL_TEAM_PLAYERS, ...JUVENIL_TEAM_PLAYERS];
    } else if (currentTeam === 'filial') {
        availablePlayers = [...JUVENIL_TEAM_PLAYERS];
    } else {
        return;
    }
    
    const sorted = availablePlayers.sort((a, b) => {
        if (getPositionOrder(a.position) !== getPositionOrder(b.position)) {
            return getPositionOrder(a.position) - getPositionOrder(b.position);
        }
        return (a.number || 99) - (b.number || 99);
    });
    
    sorted.forEach(player => {
        const option = document.createElement('option');
        option.value = player.name;
        datalist.appendChild(option);
    });
}

// Add a selected guest player to the squadState by name
function addGuestPlayerToSquad() {
    const searchInput = document.getElementById('input-guest-search');
    if (!searchInput) return;
    const playerName = searchInput.value.trim();
    if (!playerName) return;
    
    let availablePlayers = [];
    if (currentTeam === 'primer-equipo') {
        availablePlayers = [...FILIAL_TEAM_PLAYERS, ...JUVENIL_TEAM_PLAYERS];
    } else if (currentTeam === 'filial') {
        availablePlayers = [...JUVENIL_TEAM_PLAYERS];
    } else {
        return;
    }
    
    const guestPlayer = availablePlayers.find(p => p.name.toLowerCase() === playerName.toLowerCase());
    if (!guestPlayer) {
        alert('No se ha encontrado a ningún jugador invitado con ese nombre exacto. Selecciona uno de la lista.');
        return;
    }
    
    const playerId = guestPlayer.id;
    
    // Check if already in squadState
    const exists = squadState.some(p => p.id === 'guest-' + playerId || p.id === playerId);
    if (exists) {
        alert('Este jugador ya ha sido añadido a la convocatoria.');
        searchInput.value = '';
        return;
    }
    
    let teamSource = 'Filial';
    if (JUVENIL_TEAM_PLAYERS.some(p => p.id === playerId)) {
        teamSource = 'Juvenil';
    }
    
    squadState.push({
        ...guestPlayer,
        id: 'guest-' + guestPlayer.id,
        isCalled: true,
        reason: '',
        isGuest: true,
        teamSource: teamSource
    });
    
    searchInput.value = '';
    renderPlayerList();
    updateTacticalView();
    queueCloudSync();
}

// Remove a guest player from the squadState
function removeGuestPlayer(id) {
    squadState = squadState.filter(p => p.id !== id);
    renderPlayerList();
    updateTacticalView();
    queueCloudSync();
}

// Render Checkbox list of players for editing
function renderPlayerList() {
    const listContainer = document.getElementById('players-checkbox-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';
    
    // Sort players by position then by number
    const sorted = [...squadState].sort((a, b) => {
        if (getPositionOrder(a.position) !== getPositionOrder(b.position)) {
            return getPositionOrder(a.position) - getPositionOrder(b.position);
        }
        return (a.number || 99) - (b.number || 99);
    });
    
    sorted.forEach(player => {
        const item = document.createElement('div');
        item.className = `player-edit-row ${player.isCalled ? 'active' : 'inactive'}`;
        item.id = `row-${player.id}`;
        
        const mainInfo = document.createElement('div');
        mainInfo.className = 'player-main-info';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `chk-${player.id}`;
        checkbox.checked = player.isCalled;
        checkbox.addEventListener('change', (e) => {
            togglePlayerCalled(player.id, e.target.checked);
        });
        
        const label = document.createElement('label');
        label.htmlFor = `chk-${player.id}`;
        
        let guestBadgeHtml = '';
        if (player.isGuest) {
            guestBadgeHtml = `<span class="guest-badge">${player.teamSource || 'Invitado'}</span>`;
        }
        
        label.innerHTML = `
            <span class="dorsal-badge">${player.number !== '' ? player.number : '-'}</span> 
            <strong>${player.name}</strong> 
            <span class="pos-badge">${player.position}</span>
            <span class="edit-position-btn" data-id="${player.id}" style="cursor: pointer; font-size: 14px; margin-left: 5px; color: #94a3b8; transition: color 0.2s;" title="Editar posición">&#9998;</span>
            ${guestBadgeHtml}
            ${player.isGuest ? '<span class="delete-guest-btn" data-id="' + player.id + '" style="color: #EF4444; margin-left: 8px; cursor: pointer; padding: 0 4px; font-weight: bold;" title="Quitar de la convocatoria">❌</span>' : ''}
        `;
        
        mainInfo.appendChild(checkbox);
        mainInfo.appendChild(label);
        
        const deleteBtn = label.querySelector('.delete-guest-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeGuestPlayer(player.id);
            });
        }
        
        const actions = document.createElement('div');
        actions.className = 'player-action-fields';
        actions.style.display = player.isCalled ? 'none' : 'flex';
        
        const reasonLabel = document.createElement('span');
        reasonLabel.className = 'reason-select-label';
        reasonLabel.innerText = 'Motivo:';
        
        const select = document.createElement('select');
        select.id = `reason-${player.id}`;
        select.innerHTML = `
            <option value="Decisión técnica" ${player.reason === 'Decisión técnica' ? 'selected' : ''}>Decisión Técnica</option>
            <option value="Lesionado" ${player.reason === 'Lesionado' ? 'selected' : ''}>Lesionado</option>
            <option value="Otro motivo" ${player.reason === 'Otro motivo' ? 'selected' : ''}>Otro motivo</option>
        `;
        select.addEventListener('click', (e) => e.stopPropagation());
        select.addEventListener('change', (e) => {
            updatePlayerReason(player.id, e.target.value);
        });
        
        actions.appendChild(reasonLabel);
        actions.appendChild(select);
        
        item.appendChild(mainInfo);
        item.appendChild(actions);
        listContainer.appendChild(item);
    });
    
    // Attach event listeners for edit position buttons
    document.querySelectorAll('.edit-position-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const playerId = e.target.getAttribute('data-id');
            openEditModal(playerId);
        });
    });
}

let currentlyEditingPlayerId = null;

function openEditModal(playerId) {
    const player = squadState.find(p => p.id === playerId);
    if (!player) return;
    
    currentlyEditingPlayerId = playerId;
    
    document.getElementById('edit-position-player-name').innerText = player.name;
    const select = document.getElementById('edit-position-select');
    
    // Select the correct option
    let found = false;
    Array.from(select.options).forEach(opt => {
        if (opt.value.toLowerCase() === player.position.toLowerCase()) {
            opt.selected = true;
            found = true;
        }
    });
    if (!found) {
        select.value = "Sin posición";
    }
    
    document.getElementById('edit-position-overlay').style.display = 'flex';
}

// Toggle whether a player is called up
function togglePlayerCalled(id, isCalled) {
    const player = squadState.find(p => p.id === id);
    if (player) {
        player.isCalled = isCalled;
        if (isCalled) {
            player.reason = '';
        } else if (!player.reason) {
            player.reason = 'Decisión técnica';
        }
        
        // Visual feedback
        const row = document.getElementById(`row-${id}`);
        if (row) {
            row.className = `player-edit-row ${isCalled ? 'active' : 'inactive'}`;
            const actions = row.querySelector('.player-action-fields');
            actions.style.display = isCalled ? 'none' : 'flex';
        }
        
        updateTacticalView();
        queueCloudSync();
    }
}

// Update the reason for exclusion
function updatePlayerReason(id, reason) {
    const player = squadState.find(p => p.id === id);
    if (player) {
        player.reason = reason;
        queueCloudSync();
    }
}

// Update the 2D pitch view of the squad
function updateTacticalView() {
    const gksContainer = document.getElementById('pitch-gk');
    const playersContainer = document.getElementById('pitch-players');
    if (!gksContainer || !playersContainer) return;
    
    gksContainer.innerHTML = '';
    playersContainer.innerHTML = '';
    
    const calledPlayers = squadState.filter(p => p.isCalled);
    
    calledPlayers.forEach(player => {
        const dot = document.createElement('div');
        dot.className = `tactical-dot ${player.isGoalkeeper ? 'gk' : 'field'}`;
        dot.title = `${player.name} (${player.position})`;
        dot.innerHTML = `
            <span class="tactical-num">${player.number}</span>
            <span class="tactical-name">${player.name.split(' ')[0]}</span>
        `;
        
        if (player.isGoalkeeper) {
            gksContainer.appendChild(dot);
        } else {
            playersContainer.appendChild(dot);
        }
    });
}

// Parse text transcribed by voice to exclude players
function parseTextForExclusions(text) {
    const logContainer = document.getElementById('nlp-status-log');
    const sentences = text.toLowerCase().split(/[.,y]/);
    let actionTaken = false;
    
    sentences.forEach(clause => {
        clause = clause.trim();
        if (!clause) return;
        
        // Find if a player name is mentioned in this clause
        squadState.forEach(player => {
            const firstName = player.name.split(' ')[0].toLowerCase();
            const lastName = player.name.split(' ').slice(1).join(' ').toLowerCase();
            
            // Match first name or complete last name sequence
            const matchesFirstName = clause.includes(firstName) && firstName.length > 2;
            const matchesLastName = lastName.length > 3 && clause.includes(player.name.toLowerCase());
            
            if (matchesFirstName || matchesLastName) {
                // Determine reason based on keywords
                let reason = 'Decisión técnica';
                if (clause.includes('lesion') || clause.includes('lesionado') || clause.includes('dolor') || clause.includes('daño') || clause.includes('baja médica')) {
                    reason = 'Lesión';
                } else if (clause.includes('sancion') || clause.includes('sancionado') || clause.includes('roja') || clause.includes('castigo') || clause.includes('tarjetas')) {
                    reason = 'Sanción';
                }
                
                // Exclude the player
                if (player.isCalled) {
                    player.isCalled = false;
                    player.reason = reason;
                    
                    // Update checkbox and dropdown in real time
                    const chk = document.getElementById(`chk-${player.id}`);
                    if (chk) chk.checked = false;
                    
                    const reasonSel = document.getElementById(`reason-${player.id}`);
                    if (reasonSel) reasonSel.value = reason;
                    
                    // Visual row update
                    const row = document.getElementById(`row-${player.id}`);
                    if (row) {
                        row.className = 'player-edit-row inactive';
                        row.querySelector('.player-action-fields').style.display = 'flex';
                    }
                    
                    // Log to the coach UI
                    const logItem = document.createElement('div');
                    logItem.className = 'log-entry';
                    logItem.innerHTML = `✅ Excluido: <strong>${player.name}</strong> por <strong>${reason}</strong>`;
                    if (logContainer) logContainer.prepend(logItem);
                    actionTaken = true;
                }
            }
        });
    });
    
    if (actionTaken) {
        updateTacticalView();
        // Trigger alert visual effect on tactical pitch
        const pitch = document.querySelector('.futsal-pitch');
        if (pitch) {
            pitch.classList.add('flash-effect');
            setTimeout(() => pitch.classList.remove('flash-effect'), 500);
        }
    }
}

// Web Speech API Voice Recognition Setup
let recognition;
function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const voiceBtn = document.getElementById('voice-btn');
    const statusText = document.getElementById('voice-status-text');
    
    if (!SpeechRecognition) {
        if (voiceBtn) voiceBtn.disabled = true;
        if (statusText) statusText.innerText = 'Web Speech API no soportada en este navegador.';
        return;
    }
    
    recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;
    recognition.interimResults = false;
    
    const textarea = document.getElementById('voice-transcript-output');
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', () => {
            try {
                recognition.start();
                voiceBtn.classList.add('recording');
                statusText.innerText = 'Escuchando...';
            } catch (e) {
                recognition.stop();
            }
        });
    }
    
    let hasError = false;
    recognition.onend = () => {
        if (voiceBtn) voiceBtn.classList.remove('recording');
        if (!hasError && statusText) {
            statusText.innerText = 'Micrófono inactivo. Haz clic para dictar.';
        }
    };
    
    recognition.onresult = (event) => {
        hasError = false;
        const transcript = event.results[0][0].transcript;
        if (textarea) textarea.value += (textarea.value ? ' ' : '') + transcript;
        if (statusText) statusText.innerText = 'Transcripción realizada correctamente.';
        
        // Parse the newly added text
        parseTextForExclusions(transcript);
    };
    
    recognition.onerror = (event) => {
        hasError = true;
        if (voiceBtn) voiceBtn.classList.remove('recording');
        
        if (event.error === 'no-speech') {
            hasError = false;
            if (statusText) statusText.innerText = 'No se detectó voz. Haz clic para intentar de nuevo.';
            return;
        }
        
        let errorMsg = 'Error en el dictado por voz: ' + event.error;
        if (statusText) statusText.innerText = errorMsg;
        alert(errorMsg);
    };
}

function formatDateTimeString(val) {
    if (!val) return 'No especificado';
    const date = new Date(val);
    const options = { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('es-ES', options).replace(',', ' a las') + ' h';
}

// Generate and export official PDF Convocatoria (100% reliable vector PDF engine)
function generatePDF() {
    const btnText = document.getElementById('generate-pdf-btn-text');
    const spinner = document.getElementById('generate-pdf-spinner');
    
    btnText.innerText = 'Abriendo PDF Convocatoria...';
    spinner.style.display = 'inline-block';
    
    try {
        // Collect form values from the main app
        const jornadaVal = document.getElementById('input-jornada')?.options[document.getElementById('input-jornada').selectedIndex]?.text || '';
        const rivalVal = document.getElementById('input-rival')?.value || '';
        const scheduleVal = formatDateTimeString(document.getElementById('input-schedule')?.value);
        const callupTimeVal = document.getElementById('input-callup-time')?.value || '';
        const venueVal = document.getElementById('input-venue')?.value || '';
        const kitVal = document.getElementById('input-kit')?.value || '';
        const coachVal = document.getElementById('input-coach')?.value || '';
        const observationsVal = document.getElementById('input-observations')?.value || '';

        // Sort called players
        const calledPlayers = squadState.filter(p => p.isCalled).sort((a, b) => {
            if (getPositionOrder(a.position) !== getPositionOrder(b.position)) {
                return getPositionOrder(a.position) - getPositionOrder(b.position);
            }
            return (a.number || 99) - (b.number || 99);
        });
        const notCalledPlayers = squadState.filter(p => !p.isCalled);

        const teamTitles = { 'primer-equipo': 'Primer Equipo', 'filial': 'Filial', 'juvenil': 'Juvenil' };
        const teamName = teamTitles[currentTeam] || 'La Nucía FS';

        const teamClean = teamName.replace(/\s+/g, '_');
        const jornadaClean = (jornadaVal || 'Jornada').replace(/\s+/g, '_');
        const rivalClean = (rivalVal || 'Partido').replace(/\s+/g, '_');
        const docTitle = `Convocatoria_${teamClean}_${jornadaClean}_vs_${rivalClean}`;

        const logoSrc = (typeof LOGO_BASE64 !== 'undefined' && LOGO_BASE64) ? LOGO_BASE64 : 'La Nucia FS.png';

        const folioHTML = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${docTitle}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 6mm 8mm;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
            color: #1a1a1a;
            background: #ffffff;
            line-height: 1.35;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        .page-container {
            max-width: 760px;
            margin: 0 auto;
            padding: 10px;
        }
        .header-band {
            height: 4px;
            background: linear-gradient(90deg, #E30613 0%, #121212 100%);
            margin-bottom: 10px;
        }
        .letterhead-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #E30613;
            padding-bottom: 8px;
            margin-bottom: 12px;
        }
        .club-info-left {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .club-logo {
            width: 55px;
            height: 55px;
            object-fit: contain;
        }
        .club-name {
            font-family: 'Outfit', Arial, sans-serif;
            font-size: 18px;
            font-weight: 800;
            color: #121212;
            line-height: 1.1;
            text-transform: uppercase;
        }
        .club-name span { color: #E30613; }
        .club-subtitle {
            font-size: 9px;
            font-weight: 600;
            color: #555555;
            letter-spacing: 2px;
            margin-top: 2px;
            text-transform: uppercase;
        }
        .club-info-right {
            text-align: right;
            font-size: 9px;
            color: #555555;
            line-height: 1.35;
        }
        .convocatoria-title-container {
            text-align: center;
            margin-bottom: 12px;
        }
        .convocatoria-title {
            font-family: 'Outfit', Arial, sans-serif;
            font-size: 18px;
            font-weight: 800;
            color: #121212;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .convocatoria-subtitle {
            font-size: 11px;
            font-weight: 700;
            color: #E30613;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-top: 2px;
        }
        .match-details-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 12px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            font-size: 11px;
        }
        .match-details-table td {
            padding: 5px 8px;
            border: 1px solid #e2e8f0;
        }
        .detail-label {
            font-weight: 700;
            color: #121212;
            text-transform: uppercase;
            font-size: 9.5px;
            width: 16%;
        }
        .detail-value-rival {
            font-weight: 700;
            color: #E30613;
            font-size: 11.5px;
            width: 34%;
        }
        .observations-box {
            background: #FEF2F2;
            border-left: 3px solid #E30613;
            padding: 6px 10px;
            margin-bottom: 12px;
            border-radius: 0 4px 4px 0;
            font-size: 10.5px;
        }
        .observations-title {
            font-weight: 700;
            color: #E30613;
            text-transform: uppercase;
            font-size: 9px;
            margin-bottom: 2px;
        }
        .section-title {
            font-family: 'Outfit', Arial, sans-serif;
            font-size: 11.5px;
            font-weight: 700;
            color: #121212;
            text-transform: uppercase;
            border-left: 3px solid #E30613;
            padding-left: 6px;
            margin-bottom: 5px;
        }
        .player-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
            margin-bottom: 12px;
        }
        .player-table th {
            background: #121212;
            color: #ffffff;
            padding: 4px 8px;
            font-size: 9.5px;
            text-transform: uppercase;
            text-align: left;
        }
        .player-table th.center { text-align: center; }
        .player-table td {
            padding: 3px 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        .dorsal-badge {
            background: #E30613;
            color: white;
            padding: 1px 6px;
            border-radius: 3px;
            font-weight: 700;
            font-size: 10.5px;
            display: inline-block;
            min-width: 22px;
            text-align: center;
        }
        .pos-badge {
            background: #e2e8f0;
            color: #334155;
            padding: 1.5px 6px;
            border-radius: 3px;
            font-size: 9.5px;
            font-weight: 600;
        }
        .guest-badge {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
            padding: 1.5px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
            margin-left: 4px;
        }
        .reason-badge {
            padding: 1.5px 6px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: 600;
            display: inline-block;
        }
        .reason-tecnica { background: #f1f5f9; color: #475569; }
        .reason-lesion { background: #fee2e2; color: #b91c1c; }
        .reason-sancion { background: #fef3c7; color: #b45309; }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #e2e8f0;
        }
        .action-bar-top {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #1e293b;
            color: white;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Plus Jakarta Sans', Arial, sans-serif;
        }
        .btn-print {
            background: #E30613;
            color: white;
            border: none;
            padding: 8px 18px;
            border-radius: 6px;
            font-weight: bold;
            font-size: 14px;
            cursor: pointer;
        }
        .btn-print:hover { background: #b91c1c; }
        @media print {
            .action-bar-top { display: none !important; }
            body { padding-top: 0 !important; }
        }
        @media screen {
            body { padding-top: 55px; background: #e2e8f0; }
            .page-container { background: white; box-shadow: 0 5px 25px rgba(0,0,0,0.15); border-radius: 8px; margin-top: 15px; margin-bottom: 30px; }
        }
    </style>
</head>
<body>
    <div class="action-bar-top">
        <div style="font-size: 14px; font-weight: 600;">
            📄 Convocatoria Oficial — ${teamName} (${jornadaVal})
        </div>
        <div>
            <button class="btn-print" onclick="window.print();">📥 Guardar PDF / Imprimir</button>
        </div>
    </div>

    <div class="page-container">
        <div class="header-band"></div>

        <header class="letterhead-header">
            <div class="club-info-left">
                <img src="${logoSrc}" class="club-logo" alt="La Nucía FS">
                <div>
                    <div class="club-name">LA NUCÍA <span>FÚTBOL SALA</span></div>
                    <div class="club-subtitle">CLUB DEPORTIVO SPORTING LA NUCÍA</div>
                </div>
            </div>
            <div class="club-info-right">
                <div><strong>R.F.E.F. / F.F.C.V.</strong></div>
                <div>Temporada Oficial 2026/2027</div>
                <div>Pabellón Camilo Cano - La Nucía</div>
            </div>
        </header>

        <div class="convocatoria-title-container">
            <div class="convocatoria-title">CONVOCATORIA OFICIAL — ${teamName}</div>
            <div class="convocatoria-subtitle">${jornadaVal} — TEMPORADA 2026/2027</div>
        </div>

        <table class="match-details-table">
            <tr>
                <td class="detail-label">EQUIPO RIVAL:</td>
                <td class="detail-value-rival">${rivalVal || '-'}</td>
                <td class="detail-label">INSTALACIÓN:</td>
                <td>${venueVal || '-'}</td>
            </tr>
            <tr>
                <td class="detail-label">FECHA Y HORA:</td>
                <td>${scheduleVal || '-'}</td>
                <td class="detail-label">HORA CITACIÓN:</td>
                <td style="font-weight: 700; color: #E30613;">${callupTimeVal ? callupTimeVal + ' h' : '-'}</td>
            </tr>
            <tr>
                <td class="detail-label">ENTRENADOR:</td>
                <td>${coachVal || '-'}</td>
                <td class="detail-label">EQUIPACIÓN:</td>
                <td>${kitVal || '-'}</td>
            </tr>
        </table>

        ${observationsVal ? `
        <div class="observations-box">
            <div class="observations-title">OBSERVACIONES:</div>
            <div style="color: #333; font-style: italic;">${observationsVal}</div>
        </div>` : ''}

        <div style="margin-bottom: 12px;">
            <div class="section-title">JUGADORES CONVOCADOS (${calledPlayers.length})</div>
            <table class="player-table">
                <thead>
                    <tr>
                        <th style="width: 10%; text-align: center;">Dorsal</th>
                        <th style="width: 55%;">Nombre Completo</th>
                        <th style="width: 35%;">Posición</th>
                    </tr>
                </thead>
                <tbody>
                    ${calledPlayers.map((p, idx) => `
                    <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                        <td style="text-align: center;"><span class="dorsal-badge">${p.number !== '' ? p.number : '-'}</span></td>
                        <td><strong>${p.name}</strong></td>
                        <td>
                            <span class="pos-badge">${p.position}</span>
                            ${p.isGuest ? `<span class="guest-badge">${p.teamSource || 'Invitado'}</span>` : ''}
                        </td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>

        ${notCalledPlayers.length > 0 ? `
        <div style="margin-bottom: 10px;">
            <div class="section-title" style="border-left-color: #94a3b8; color: #64748b;">JUGADORES NO CONVOCADOS / BAJAS (${notCalledPlayers.length})</div>
            <table class="player-table">
                <thead>
                    <tr style="background: #475569;">
                        <th style="width: 60%;">Jugador</th>
                        <th style="width: 40%;">Motivo</th>
                    </tr>
                </thead>
                <tbody>
                    ${notCalledPlayers.map((p, idx) => {
                        let badgeClass = 'reason-tecnica';
                        if (p.reason === 'Lesionado') badgeClass = 'reason-lesion';
                        if (p.reason === 'Otro motivo') badgeClass = 'reason-sancion';
                        return `
                        <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
                            <td>${p.name}</td>
                            <td><span class="reason-badge ${badgeClass}">${p.reason || 'Decisión técnica'}</span></td>
                        </tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>` : ''}

        <table class="footer-table">
            <tr>
                <td style="vertical-align: bottom; text-align: left;">
                    <div style="font-size: 8.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">ENTRENADOR PRINCIPAL</div>
                    <div style="font-size: 13px; font-weight: 800; color: #121212; margin-top: 2px;">${coachVal || 'David Valverde Bonastre'}</div>
                    <div style="font-size: 8.5px; color: #64748b;">C.D. Sporting La Nucía Fútbol Sala</div>
                </td>
                <td style="vertical-align: bottom; text-align: right; opacity: 0.35;">
                    <div style="display: inline-flex; align-items: center; justify-content: center; border: 2px dashed #94a3b8; border-radius: 50%; width: 50px; height: 50px; font-size: 6.5px; font-weight: bold; color: #E30613; text-align: center; line-height: 1.1; padding: 2px;">
                        LA NUCÍA<br>FÚTBOL SALA<br>OFICIAL
                    </div>
                </td>
            </tr>
        </table>
    </div>

    <script>
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 300);
        });
    </script>
</body>
</html>`;

        const printWin = window.open('', '_blank');
        if (printWin) {
            printWin.document.open();
            printWin.document.write(folioHTML);
            printWin.document.close();
        } else {
            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '0';
            iframe.style.bottom = '0';
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.border = '0';
            document.body.appendChild(iframe);
            const doc = iframe.contentWindow.document;
            doc.open();
            doc.write(folioHTML);
            doc.close();
            iframe.contentWindow.focus();
            setTimeout(() => {
                iframe.contentWindow.print();
                setTimeout(() => { if (iframe.parentNode) document.body.removeChild(iframe); }, 3000);
            }, 400);
        }

        btnText.innerText = 'Generar PDF Convocatoria';
        spinner.style.display = 'none';

    } catch (err) {
        console.error('Error abriendo PDF:', err);
        btnText.innerText = 'Error al generar PDF';
        spinner.style.display = 'none';
        setTimeout(() => {
            btnText.innerText = 'Generar PDF Convocatoria';
        }, 3000);
    }
}

// Generate Whatsapp text with official 2026-2027 season icons
function sendWhatsApp() {
    const jornadaVal = document.getElementById('input-jornada')?.options[document.getElementById('input-jornada').selectedIndex]?.text || '';
    const rivalVal = document.getElementById('input-rival')?.value || '';
    const scheduleVal = formatDateTimeString(document.getElementById('input-schedule')?.value);
    const callupTimeVal = document.getElementById('input-callup-time')?.value || '';
    const venueVal = document.getElementById('input-venue')?.value || '';
    const kitVal = document.getElementById('input-kit')?.value || '';
    const observationsVal = document.getElementById('input-observations')?.value || '';

    const teamTitleMap = {
        'primer-equipo': '1º EQUIPO',
        'filial': 'FILIAL',
        'juvenil': 'JUVENIL'
    };
    const teamTitle = teamTitleMap[currentTeam] || '1º EQUIPO';

    let text = `🔴⚫ *CONVOCATORIA ${teamTitle} - LA NUCÍA FS* 🔴⚫\n\n`;
    text += `⚽ *Competición / Jornada:* ${jornadaVal}${rivalVal ? ' vs *' + rivalVal + '*' : ''}\n`;
    text += `📅 *Fecha y Hora:* ${scheduleVal}\n`;
    if (callupTimeVal) {
        text += `⏰ *Hora de Convocatoria:* ${callupTimeVal} h\n`;
    }
    text += `📍 *Lugar / Pabellón:* ${venueVal}\n`;
    text += `👕 *Equipación:* ${kitVal}\n`;

    if (observationsVal.trim()) {
        text += `📝 *Observaciones:* ${observationsVal.trim()}\n`;
    }

    text += `\n📋 *JUGADORES CONVOCADOS:*\n`;

    const calledPlayers = squadState.filter(p => p.isCalled).sort((a, b) => {
        if (getPositionOrder(a.position) !== getPositionOrder(b.position)) {
            return getPositionOrder(a.position) - getPositionOrder(b.position);
        }
        return (a.number || 99) - (b.number || 99);
    });

    calledPlayers.forEach((p, idx) => {
        const icon = p.isGoalkeeper ? '🧤' : '⚽';
        const numStr = (p.number !== '' && p.number !== undefined) ? `[#${p.number}]` : '';
        const guestTag = p.isGuest ? ` _(Invitado ${p.teamSource || ''})_` : '';
        text += `${icon} ${idx + 1}. *${p.name}* ${numStr} - ${p.position}${guestTag}\n`;
    });

    const notCalledPlayers = squadState.filter(p => !p.isCalled);
    if (notCalledPlayers.length > 0) {
        text += `\n❌ *NO CONVOCADOS / BAJAS:*\n`;
        notCalledPlayers.forEach(p => {
            text += `❌ *${p.name}* (${p.reason || 'Decisión técnica'})\n`;
        });
    }

    text += `\n_CD La Nucía FS ${teamTitle} 2026/2027_`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const waUrl = isMobile
        ? 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text)
        : 'https://web.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(waUrl, '_blank');
}

// ── CLOUD REALTIME SYNCHRONIZATION ──────────────────────────────────────────
const CLOUD_SYNC_ENDPOINT = (window.location.protocol === 'http:' || window.location.protocol === 'https:')
    ? '/api/sync'
    : 'https://extendsclass.com/api/json-storage/bin/cddabda';

let cloudLastUpdated = 0;
let isSyncingCloud = false;
let cloudSyncTimeout = null;

function saveCurrentTeamDraftToLocal() {
    const draftsStr = localStorage.getItem('laNuciaFS_drafts');
    const drafts = draftsStr ? JSON.parse(draftsStr) : {};
    
    const existingPlanViaje = drafts[currentTeam]?.planViaje || null;

    drafts[currentTeam] = {
        jornada: document.getElementById('input-jornada')?.value || '1',
        rival: document.getElementById('input-rival')?.value || '',
        schedule: document.getElementById('input-schedule')?.value || '',
        callupTime: document.getElementById('input-callup-time')?.value || '',
        venue: document.getElementById('input-venue')?.value || 'Pabellón Camilo Cano',
        coach: document.getElementById('input-coach')?.value || '',
        kit: document.getElementById('input-kit')?.value || 'Primera Equipación',
        observations: document.getElementById('input-observations')?.value || '',
        squadState: JSON.parse(JSON.stringify(squadState)),
        planViaje: existingPlanViaje
    };
    
    localStorage.setItem('laNuciaFS_drafts', JSON.stringify(drafts));
    return drafts;
}

function updateCloudStatus(status) {
    const badge = document.getElementById('cloud-status-badge');
    if (!badge) return;
    if (status === 'syncing') {
        badge.innerHTML = '<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#F59E0B; animation:pulse 1s infinite;"></span> Guardando en la nube...';
        badge.style.color = '#F59E0B';
    } else if (status === 'synced') {
        badge.innerHTML = '<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#10B981;"></span> Sincronizado en todos los dispositivos';
        badge.style.color = '#10B981';
    } else if (status === 'error') {
        badge.innerHTML = '<span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#EF4444;"></span> Error de conexión';
        badge.style.color = '#EF4444';
    }
}

function queueCloudSync() {
    saveCurrentTeamDraftToLocal();
    updateCloudStatus('syncing');
    if (cloudSyncTimeout) clearTimeout(cloudSyncTimeout);
    cloudSyncTimeout = setTimeout(async () => {
        await pushCloudData();
    }, 700);
}

async function fetchCloudData() {
    if (isSyncingCloud) return;
    try {
        isSyncingCloud = true;
        const res = await fetch(CLOUD_SYNC_ENDPOINT, {
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!data) return;

        // Sync & merge deleted history IDs across devices
        const localDeleted = getDeletedHistoryIds();
        const cloudDeleted = Array.isArray(data.deletedHistoryIds) ? data.deletedHistoryIds.map(String) : [];
        const mergedDeleted = Array.from(new Set([...localDeleted, ...cloudDeleted, '1787641678059']));
        saveDeletedHistoryIds(mergedDeleted);

        const localSigs = getDeletedHistorySignatures();
        const cloudSigs = Array.isArray(data.deletedSignatures) ? data.deletedSignatures.map(String) : [];
        const mergedSigs = Array.from(new Set([...localSigs, ...cloudSigs, 'manresa', 'covisa']));
        saveDeletedHistorySignatures(mergedSigs);

        // Filter local and cloud histories using deleted IDs and permanent filters
        const localHistory = getHistory();
        const rawCloudHistory = Array.isArray(data.history) ? data.history : [];
        const cloudHistory = rawCloudHistory.filter(cloudItem => !isDeletedOrForbiddenHistoryRecord(cloudItem));

        // Auto-merge check: If this device has valid local history items that are NOT in the cloud, merge and push
        const missingInCloud = localHistory.filter(localItem => 
            !isDeletedOrForbiddenHistoryRecord(localItem) &&
            !cloudHistory.some(cloudItem => String(cloudItem.id) === String(localItem.id) || 
                (cloudItem.jornada === localItem.jornada && cloudItem.team === localItem.team && cloudItem.rival === localItem.rival))
        );

        if (missingInCloud.length > 0 || rawCloudHistory.length !== cloudHistory.length) {
            const mergedHistory = [...cloudHistory, ...missingInCloud];
            saveHistory(mergedHistory);
            await pushCloudData();
            if (document.getElementById('history-grid')?.style.display !== 'none') {
                renderHistory();
            }
            return;
        }

        const cloudTimestamp = data.lastUpdated || 0;
        if (cloudTimestamp > cloudLastUpdated) {
            cloudLastUpdated = cloudTimestamp;

            // Sync custom positions
            if (data.customPositions && typeof data.customPositions === 'object') {
                localStorage.setItem('laNuciaFS_customPositions', JSON.stringify(data.customPositions));
            }

            // Sync history
            if (Array.isArray(data.history)) {
                saveHistory(cloudHistory);
                const historyGrid = document.getElementById('history-grid');
                if (historyGrid && historyGrid.style.display !== 'none') {
                    renderHistory();
                }
            }

            updateCloudStatus('synced');
        }
    } catch (err) {
        console.warn('Error sincronizando con la nube:', err);
    } finally {
        isSyncingCloud = false;
    }
}

async function pushCloudData() {
    try {
        const drafts = saveCurrentTeamDraftToLocal();
        const history = getHistory();
        const deletedHistoryIds = getDeletedHistoryIds();
        const deletedSignatures = getDeletedHistorySignatures();
        const customPositions = getCustomPositions();
        
        const payload = {
            drafts: drafts,
            history: history,
            deletedHistoryIds: deletedHistoryIds,
            deletedSignatures: deletedSignatures,
            customPositions: customPositions,
            lastUpdated: Date.now()
        };
        cloudLastUpdated = payload.lastUpdated;

        await fetch(CLOUD_SYNC_ENDPOINT, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(payload)
        });
        updateCloudStatus('synced');
    } catch (err) {
        console.warn('Error subiendo a la nube:', err);
        updateCloudStatus('error');
    }
}

function startRealtimeSync() {
    // Initial fetch
    fetchCloudData();

    // Poll every 4 seconds for instant multi-device sync
    setInterval(() => {
        fetchCloudData();
    }, 4000);

    // Sync when returning to tab
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            fetchCloudData();
        }
    });

    window.addEventListener('focus', () => {
        fetchCloudData();
    });

    window.addEventListener('online', () => {
        fetchCloudData();
    });
}

// Deleted History IDs Tracking & Guard
function getDeletedHistoryIds() {
    try {
        const deletedStr = localStorage.getItem('laNuciaFS_deletedHistoryIds');
        const list = deletedStr ? JSON.parse(deletedStr) : [];
        const result = Array.isArray(list) ? list.map(String) : [];
        if (!result.includes('1787641678059')) {
            result.push('1787641678059');
        }
        return result;
    } catch (e) {
        return ['1787641678059'];
    }
}

function saveDeletedHistoryIds(ids) {
    try {
        const set = new Set(Array.isArray(ids) ? ids.map(String) : []);
        set.add('1787641678059');
        localStorage.setItem('laNuciaFS_deletedHistoryIds', JSON.stringify(Array.from(set)));
    } catch (e) {}
}

// Deleted History Signatures Tracking
function getDeletedHistorySignatures() {
    try {
        const str = localStorage.getItem('laNuciaFS_deletedSignatures');
        const list = str ? JSON.parse(str) : [];
        const result = Array.isArray(list) ? list.map(String) : [];
        if (!result.includes('manresa')) result.push('manresa');
        if (!result.includes('covisa')) result.push('covisa');
        return result;
    } catch(e) {
        return ['manresa', 'covisa'];
    }
}

function saveDeletedHistorySignatures(sigs) {
    try {
        const set = new Set(Array.isArray(sigs) ? sigs.map(String) : []);
        set.add('manresa');
        set.add('covisa');
        localStorage.setItem('laNuciaFS_deletedSignatures', JSON.stringify(Array.from(set)));
    } catch(e) {}
}

function isDeletedOrForbiddenHistoryRecord(record) {
    if (!record || typeof record !== 'object') return true;
    
    const idStr = String(record.id || '');
    if (idStr === '1787641678059') return true;
    
    const deletedIds = getDeletedHistoryIds();
    if (idStr && deletedIds.includes(idStr)) return true;
    
    const rival = String(record.rival || '').toLowerCase();
    const jornada = String(record.jornada || '').toLowerCase();
    const combined = `${rival} ${jornada}`;
    
    if (combined.includes('manresa') || combined.includes('covisa')) {
        if (idStr && !deletedIds.includes(idStr)) {
            deletedIds.push(idStr);
            saveDeletedHistoryIds(deletedIds);
        }
        return true;
    }
    
    const signatures = getDeletedHistorySignatures();
    const sig1 = `${record.team || ''}__${record.jornada || ''}__${record.rival || ''}`.toLowerCase();
    for (const sig of signatures) {
        if (sig && (sig1.includes(sig.toLowerCase()) || combined.includes(sig.toLowerCase()))) {
            return true;
        }
    }
    
    return false;
}

// History Management
function getHistory() {
    const historyStr = localStorage.getItem('laNuciaFS_history');
    if (historyStr) {
        try {
            const list = JSON.parse(historyStr);
            if (Array.isArray(list)) {
                return list.filter(item => !isDeletedOrForbiddenHistoryRecord(item));
            }
            return [];
        } catch (e) {
            return [];
        }
    }
    return [];
}

function saveHistory(data) {
    const cleanData = (Array.isArray(data) ? data : []).filter(item => !isDeletedOrForbiddenHistoryRecord(item));
    localStorage.setItem('laNuciaFS_history', JSON.stringify(cleanData));
}

function showToast(message, type = 'success') {
    let toast = document.getElementById('app-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'app-toast';
        toast.style.cssText = 'position: fixed; bottom: 25px; right: 25px; z-index: 10000; padding: 14px 22px; border-radius: 10px; font-size: 14px; font-weight: bold; box-shadow: 0 10px 25px rgba(0,0,0,0.4); display: flex; align-items: center; gap: 10px; transition: opacity 0.3s, transform 0.3s; opacity: 0; pointer-events: none;';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    if (type === 'success') {
        toast.style.background = '#10B981';
        toast.style.color = '#FFFFFF';
    } else {
        toast.style.background = '#EF4444';
        toast.style.color = '#FFFFFF';
    }
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 3500);
}

function resetWorkspaceToNew(team = currentTeam) {
    // 1. Clear active draft in localStorage
    const draftsStr = localStorage.getItem('laNuciaFS_drafts');
    const drafts = draftsStr ? JSON.parse(draftsStr) : {};
    delete drafts[team];
    localStorage.setItem('laNuciaFS_drafts', JSON.stringify(drafts));
    
    // 2. Clear all input elements directly
    const inputRival = document.getElementById('input-rival');
    if (inputRival) inputRival.value = '';
    
    const inputSchedule = document.getElementById('input-schedule');
    if (inputSchedule) inputSchedule.value = '';
    
    const inputCallup = document.getElementById('input-callup-time');
    if (inputCallup) inputCallup.value = '';
    
    const inputObs = document.getElementById('input-observations');
    if (inputObs) inputObs.value = '';
    
    const inputGuest = document.getElementById('input-guest-search');
    if (inputGuest) inputGuest.value = '';
    
    const inputVenue = document.getElementById('input-venue');
    if (inputVenue) inputVenue.value = 'Pabellón Camilo Cano';
    
    const inputKit = document.getElementById('input-kit');
    if (inputKit) inputKit.value = 'Primera Equipación';
    
    const selectJornada = document.getElementById('input-jornada');
    if (selectJornada && selectJornada.options.length > 0) {
        selectJornada.selectedIndex = 0;
    }

    // 3. Reset squadState: all players called, no reasons, no guest players
    squadState = [];
    const customPositions = getCustomPositions();
    let playersSource = [];
    if (team === 'primer-equipo') {
        playersSource = FIRST_TEAM_PLAYERS;
        const inputCoach = document.getElementById('input-coach');
        if (inputCoach) inputCoach.value = 'David Valverde Bonastre';
    } else if (team === 'filial') {
        playersSource = FILIAL_TEAM_PLAYERS;
        const inputCoach = document.getElementById('input-coach');
        if (inputCoach) inputCoach.value = 'Jona';
    } else if (team === 'juvenil') {
        playersSource = JUVENIL_TEAM_PLAYERS;
        const inputCoach = document.getElementById('input-coach');
        if (inputCoach) inputCoach.value = 'Entrenador Juvenil';
    }

    playersSource.forEach(player => {
        squadState.push({
            ...player,
            position: customPositions[player.id] || player.position,
            isCalled: true,
            reason: '',
            isGuest: false
        });
    });

    // 4. Reset Plan de Viaje for Primer Equipo
    const planViajeCard = document.getElementById('plan-viaje-card');
    if (planViajeCard) {
        planViajeCard.style.display = (team === 'primer-equipo') ? 'block' : 'none';
    }
    if (team === 'primer-equipo') {
        updatePlanViajeUI();
    }

    // 5. Clear voice transcripts / logs
    const voiceTranscript = document.getElementById('voice-transcript-output');
    if (voiceTranscript) voiceTranscript.value = '';
    const nlpLog = document.getElementById('nlp-status-log');
    if (nlpLog) nlpLog.innerHTML = '<div class="log-empty">Ninguna acción procesada todavía.</div>';

    // 6. Re-render player list and tactical view
    renderPlayerList();
    updateTacticalView();

    // 7. Save fresh empty draft locally and push to cloud
    saveCurrentTeamDraftToLocal();
    cloudLastUpdated = Date.now();
    pushCloudData();

    // 8. Scroll directly to top
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
}

function saveCurrentToHistory() {
    const jornadaVal = document.getElementById('input-jornada')?.options[document.getElementById('input-jornada').selectedIndex]?.text || 'Desconocida';
    const rivalVal = document.getElementById('input-rival')?.value || 'Desconocido';
    
    const id = Date.now().toString();
    
    const record = {
        id: id,
        timestamp: Date.now(),
        team: currentTeam,
        jornada: jornadaVal,
        rival: rivalVal,
        schedule: document.getElementById('input-schedule')?.value || '',
        callupTime: document.getElementById('input-callup-time')?.value || '',
        venue: document.getElementById('input-venue')?.value || '',
        coach: document.getElementById('input-coach')?.value || '',
        kit: document.getElementById('input-kit')?.value || '',
        observations: document.getElementById('input-observations')?.value || '',
        squadState: JSON.parse(JSON.stringify(squadState))
    };
    
    const history = getHistory();
    
    // Check if there is already a record for the same team and jornada
    const existingIndex = history.findIndex(h => h.jornada === jornadaVal && h.team === currentTeam);
    
    if (existingIndex !== -1) {
        record.id = history[existingIndex].id;
        history[existingIndex] = record;
    } else {
        history.unshift(record);
    }
    
    saveHistory(history);
    renderHistory();
    
    // Reset workspace to clean slate for the next convocatoria!
    resetWorkspaceToNew(currentTeam);
    
    showToast('✅ Convocatoria guardada en el historial. Panel listo para la siguiente.');
}

function deleteFromHistory(id) {
    if (confirm('¿Estás seguro de que deseas borrar este registro del historial?')) {
        const idStr = String(id || '');
        const deletedIds = getDeletedHistoryIds();
        if (idStr && !deletedIds.includes(idStr)) {
            deletedIds.push(idStr);
            saveDeletedHistoryIds(deletedIds);
        }

        let rawHistory = [];
        try {
            const historyStr = localStorage.getItem('laNuciaFS_history');
            rawHistory = historyStr ? JSON.parse(historyStr) : [];
        } catch(e) {}

        const targetItem = rawHistory.find(item => String(item?.id) === idStr);
        if (targetItem) {
            const sig = `${targetItem.team || ''}__${targetItem.jornada || ''}__${targetItem.rival || ''}`.toLowerCase();
            const sigs = getDeletedHistorySignatures();
            if (!sigs.includes(sig)) {
                sigs.push(sig);
                saveDeletedHistorySignatures(sigs);
            }
        }

        const cleanHistory = rawHistory.filter(item => String(item?.id) !== idStr && !isDeletedOrForbiddenHistoryRecord(item));
        saveHistory(cleanHistory);
        renderHistory();
        pushCloudData();
        showToast('Convocatoria eliminada correctamente.');
    }
}

function clearAllHistory() {
    if (confirm('¿Estás seguro de que deseas vaciar TODO el historial? Esta acción no se puede deshacer.')) {
        const current = getHistory();
        const deletedIds = getDeletedHistoryIds();
        const sigs = getDeletedHistorySignatures();
        current.forEach(item => {
            if (item && item.id) {
                const idStr = String(item.id);
                if (!deletedIds.includes(idStr)) deletedIds.push(idStr);
            }
            if (item && item.team && item.rival) {
                const sig = `${item.team || ''}__${item.jornada || ''}__${item.rival || ''}`.toLowerCase();
                if (!sigs.includes(sig)) sigs.push(sig);
            }
        });
        saveDeletedHistoryIds(deletedIds);
        saveDeletedHistorySignatures(sigs);
        localStorage.removeItem('laNuciaFS_history');
        renderHistory();
        pushCloudData();
        showToast('Historial vaciado completamente.');
    }
}

function loadFromHistory(id) {
    if (!confirm('¿Deseas cargar esta convocatoria? Esto sobreescribirá los datos actuales en pantalla.')) {
        return;
    }
    
    const history = getHistory();
    const record = history.find(item => item.id === id);
    if (!record) return;
    
    // Switch team if necessary
    if (currentTeam !== record.team) {
        currentTeam = record.team;
        document.getElementById('tab-primer-equipo')?.classList.toggle('active', currentTeam === 'primer-equipo');
        document.getElementById('tab-filial')?.classList.toggle('active', currentTeam === 'filial');
        document.getElementById('tab-juvenil')?.classList.toggle('active', currentTeam === 'juvenil');
        
        const searchContainer = document.getElementById('guest-search-container');
        const searchLabel = document.getElementById('label-guest-search');
        if (searchContainer && searchLabel) {
            if (currentTeam === 'primer-equipo') {
                searchContainer.style.display = 'flex';
                searchLabel.innerText = 'Añadir Jugador (Filial o Juvenil)';
            } else if (currentTeam === 'filial') {
                searchContainer.style.display = 'flex';
                searchLabel.innerText = 'Añadir Jugador (Juvenil)';
            } else {
                searchContainer.style.display = 'none';
            }
        }
    }
    
    // Switch back to workspace view
    document.getElementById('tab-historial')?.classList.remove('active');
    document.getElementById('workspace-grid').style.display = 'grid';
    document.getElementById('actions-bar').style.display = 'flex';
    document.getElementById('history-grid').style.display = 'none';
    
    // Set fields
    const selectJornada = document.getElementById('input-jornada');
    if (selectJornada) {
        Array.from(selectJornada.options).forEach(opt => {
            if (opt.text === record.jornada || opt.value === record.jornada) {
                selectJornada.value = opt.value;
            }
        });
    }
    
    if (document.getElementById('input-rival')) document.getElementById('input-rival').value = record.rival;
    if (document.getElementById('input-schedule')) document.getElementById('input-schedule').value = record.schedule;
    if (document.getElementById('input-callup-time')) document.getElementById('input-callup-time').value = record.callupTime;
    if (document.getElementById('input-venue')) document.getElementById('input-venue').value = record.venue;
    if (document.getElementById('input-coach')) document.getElementById('input-coach').value = record.coach;
    if (document.getElementById('input-kit')) document.getElementById('input-kit').value = record.kit;
    if (document.getElementById('input-observations')) document.getElementById('input-observations').value = record.observations;
    
    squadState = record.squadState;
    renderPlayerList();
    updateTacticalView();
}

function renderHistory() {
    const container = document.getElementById('history-list-container');
    if (!container) return;
    
    const history = getHistory().filter(record => !isDeletedOrForbiddenHistoryRecord(record));
    container.innerHTML = '';
    
    if (history.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 20px;">No hay convocatorias guardadas.</div>';
        return;
    }
    
    // Filter history based on role:
    // - admin: only primer equipo records
    // - restricted: only filial + juvenil records
    let filteredHistory = history;
    if (userRole === 'restricted') {
        filteredHistory = history.filter(record => record.team !== 'primer-equipo');
        if (filteredHistory.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 20px;">No hay convocatorias guardadas para Filial o Juvenil.</div>';
            return;
        }
    } else {
        // admin sees only primer equipo history
        filteredHistory = history.filter(record => record.team === 'primer-equipo');
        if (filteredHistory.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: #64748b; padding: 20px;">No hay convocatorias guardadas para el Primer Equipo.</div>';
            return;
        }
    }
    
    filteredHistory.forEach(record => {
        const dateObj = new Date(record.timestamp);
        const dateStr = dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const card = document.createElement('div');
        card.style.cssText = 'border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: white; display: flex; flex-direction: column; gap: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';
        
        const header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; flex-wrap: wrap; gap: 8px;';
        
        let teamBadgeHtml = '';
        if (record.team === 'primer-equipo') {
            teamBadgeHtml = '<span style="display: inline-block; margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; font-weight: bold;">🔴 Primer Equipo</span>';
        } else if (record.team === 'juvenil') {
            teamBadgeHtml = '<span style="display: inline-block; margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #fef3c7; color: #b45309; border: 1px solid #fcd34d; font-weight: bold;">🟡 Juvenil</span>';
        } else {
            teamBadgeHtml = '<span style="display: inline-block; margin-left: 8px; font-size: 11px; padding: 2px 8px; border-radius: 12px; background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd; font-weight: bold;">🔵 Filial</span>';
        }
        
        header.innerHTML = `
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                <span style="font-weight: bold; color: #1e293b; font-size: 14px;">${record.jornada} vs ${record.rival}</span>
                ${teamBadgeHtml}
            </div>
            <div style="font-size: 12px; color: #64748b;">Guardado el ${dateStr}</div>
        `;
        
        const calledCount = (record.squadState || []).filter(p => p.isCalled).length;
        const notCalledCount = (record.squadState || []).filter(p => !p.isCalled).length;
        
        const body = document.createElement('div');
        body.style.cssText = 'display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;';
        body.innerHTML = `
            <div style="font-size: 13px; color: #475569;">
                <div><strong>Fecha partido:</strong> ${formatDateTimeString(record.schedule)}</div>
                <div><strong>Convocados:</strong> <span style="color: #10b981; font-weight: bold;">${calledCount}</span> | <strong>Bajas:</strong> <span style="color: #ef4444; font-weight: bold;">${notCalledCount}</span></div>
            </div>
        `;
        
        const actions = document.createElement('div');
        actions.style.cssText = 'display: flex; gap: 8px;';
        
        const loadBtn = document.createElement('button');
        loadBtn.innerText = 'Cargar Datos';
        loadBtn.style.cssText = 'background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: bold;';
        loadBtn.onclick = () => loadFromHistory(record.id);
        
        const delBtn = document.createElement('button');
        delBtn.innerText = '🗑️';
        delBtn.title = 'Borrar del historial';
        delBtn.style.cssText = 'background: #fee2e2; color: #ef4444; border: none; padding: 6px 10px; border-radius: 6px; cursor: pointer; font-size: 13px;';
        delBtn.onclick = () => deleteFromHistory(record.id);
        
        actions.appendChild(loadBtn);
        actions.appendChild(delBtn);
        
        body.appendChild(actions);
        card.appendChild(header);
        card.appendChild(body);
        container.appendChild(card);
    });
}

// ── PLAN DE VIAJE (EXCLUSIVO PRIMER EQUIPO) ─────────────────────────────────

function getPlanViaje() {
    try {
        const draftsStr = localStorage.getItem('laNuciaFS_drafts');
        if (!draftsStr) return null;
        const drafts = JSON.parse(draftsStr);
        return drafts?.['primer-equipo']?.planViaje || null;
    } catch (e) {
        return null;
    }
}

function savePlanViaje(planViajeObj) {
    try {
        const draftsStr = localStorage.getItem('laNuciaFS_drafts');
        const drafts = draftsStr ? JSON.parse(draftsStr) : {};
        if (!drafts['primer-equipo']) drafts['primer-equipo'] = {};
        drafts['primer-equipo'].planViaje = planViajeObj;
        localStorage.setItem('laNuciaFS_drafts', JSON.stringify(drafts));
        updatePlanViajeUI();
        queueCloudSync();
    } catch (e) {
        console.error('Error guardando Plan de Viaje:', e);
    }
}

function updatePlanViajeUI() {
    const plan = getPlanViaje();
    const filenameEl = document.getElementById('plan-viaje-filename');
    const infoEl = document.getElementById('plan-viaje-info');
    const iconEl = document.getElementById('plan-viaje-icon');
    const deleteBtn = document.getElementById('btn-delete-plan-viaje');
    const actionsDiv = document.getElementById('plan-viaje-actions');

    if (!filenameEl) return;

    if (plan && plan.fileData) {
        const dateStr = plan.uploadedAt ? new Date(plan.uploadedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
        const sizeStr = plan.fileSize ? ` (${(plan.fileSize / 1024).toFixed(1)} KB)` : '';
        filenameEl.innerText = plan.fileName || 'Plan_de_Viaje.pdf';
        filenameEl.style.color = '#38bdf8';
        infoEl.innerText = `Subido el ${dateStr}${sizeStr}`;
        if (iconEl) iconEl.innerText = '✅';
        if (deleteBtn) deleteBtn.style.display = 'inline-block';
        if (actionsDiv) actionsDiv.style.display = 'flex';
    } else {
        filenameEl.innerText = 'No hay ningún Plan de Viaje subido';
        filenameEl.style.color = 'var(--text-light)';
        infoEl.innerText = 'Selecciona un archivo PDF para adjuntarlo';
        if (iconEl) iconEl.innerText = '📄';
        if (deleteBtn) deleteBtn.style.display = 'none';
        if (actionsDiv) actionsDiv.style.display = 'none';
    }
}

function viewPlanViaje() {
    const plan = getPlanViaje();
    if (!plan || !plan.fileData) {
        alert('No hay ningún Plan de Viaje disponible para visualizar.');
        return;
    }

    try {
        const base64Data = plan.fileData.includes(',') ? plan.fileData.split(',')[1] : plan.fileData;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Uint8Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const blob = new Blob([byteNumbers], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
    } catch (e) {
        console.error('Error abriendo PDF:', e);
        window.open(plan.fileData, '_blank');
    }
}

async function sendPlanViajeWhatsApp() {
    const plan = getPlanViaje();
    const jornadaVal = document.getElementById('input-jornada')?.options[document.getElementById('input-jornada').selectedIndex]?.text || '';
    const rivalVal = document.getElementById('input-rival')?.value || '';
    const scheduleVal = formatDateTimeString(document.getElementById('input-schedule')?.value);
    const callupTimeVal = document.getElementById('input-callup-time')?.value || '';
    const venueVal = document.getElementById('input-venue')?.value || '';
    const kitVal = document.getElementById('input-kit')?.value || '';

    let text = `🔴⚫ *PLAN DE VIAJE - LA NUCÍA FS (1º EQUIPO)* 🔴⚫\n\n`;
    text += `⚽ *Competición / Partido:* ${jornadaVal}${rivalVal ? ' vs *' + rivalVal + '*' : ''}\n`;
    text += `📅 *Fecha del Partido:* ${scheduleVal}\n`;
    if (callupTimeVal) {
        text += `⏰ *Hora de Salida / Citación:* ${callupTimeVal} h\n`;
    }
    text += `📍 *Destino / Pabellón:* ${venueVal}\n`;
    text += `👕 *Equipación:* ${kitVal}\n\n`;

    if (plan && plan.fileName) {
        text += `📄 *Documento adjunto:* ${plan.fileName}\n\n`;
    } else {
        text += `🚌 *Plan de Viaje:* Salida oficial de la expedición del 1º Equipo.\n\n`;
    }

    text += `_C.D. Sporting La Nucía Fútbol Sala - Temporada 2026/2027_`;

    if (plan && plan.fileData) {
        try {
            const base64Data = plan.fileData.includes(',') ? plan.fileData.split(',')[1] : plan.fileData;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const fileName = plan.fileName || `Plan_Viaje_${rivalVal ? rivalVal.replace(/\s+/g, '_') : 'Primer_Equipo'}.pdf`;
            const file = new File([byteNumbers], fileName, { type: 'application/pdf' });

            // On mobile / modern browsers, share the actual PDF document file directly to WhatsApp!
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `Plan de Viaje - ${jornadaVal}`,
                    text: text
                });
                return;
            }
        } catch (err) {
            console.log('Web Share API with file not supported or dismissed:', err);
        }

        // Fallback for Desktop: Auto-download the PDF file so user has it ready
        try {
            const base64Data = plan.fileData.includes(',') ? plan.fileData.split(',')[1] : plan.fileData;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteNumbers], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = plan.fileName || 'Plan_de_Viaje.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.error('Error in PDF download fallback:', e);
        }
    }

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const waUrl = isMobile
        ? 'https://api.whatsapp.com/send?text=' + encodeURIComponent(text)
        : 'https://web.whatsapp.com/send?text=' + encodeURIComponent(text);
    window.open(waUrl, '_blank');
}

// Event Listeners setup
function setupEventListeners() {
    const generatePdfBtn = document.getElementById('generate-pdf-btn');
    if (generatePdfBtn) generatePdfBtn.addEventListener('click', generatePDF);

    // Plan de Viaje Event Listeners (Primer Equipo)
    const btnUploadPlan = document.getElementById('btn-upload-plan-viaje');
    const inputPlanPdf = document.getElementById('input-plan-viaje-pdf');
    const btnDeletePlan = document.getElementById('btn-delete-plan-viaje');
    const btnViewPlan = document.getElementById('btn-view-plan-viaje');
    const btnSendPlanWa = document.getElementById('btn-send-plan-viaje-whatsapp');

    if (btnUploadPlan && inputPlanPdf) {
        btnUploadPlan.addEventListener('click', () => {
            inputPlanPdf.value = '';
            inputPlanPdf.click();
        });

        inputPlanPdf.addEventListener('change', (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
                alert('Por favor, selecciona un archivo en formato PDF.');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande (máximo 5 MB).');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const planObj = {
                    fileName: file.name,
                    fileData: event.target.result,
                    fileSize: file.size,
                    uploadedAt: Date.now()
                };
                savePlanViaje(planObj);
                alert('¡Plan de Viaje subido y guardado correctamente!');
            };
            reader.readAsDataURL(file);
        });
    }

    if (btnDeletePlan) {
        btnDeletePlan.addEventListener('click', () => {
            if (confirm('¿Estás seguro de que deseas eliminar el Plan de Viaje adjunto?')) {
                savePlanViaje(null);
            }
        });
    }

    if (btnViewPlan) {
        btnViewPlan.addEventListener('click', viewPlanViaje);
    }

    if (btnSendPlanWa) {
        btnSendPlanWa.addEventListener('click', sendPlanViajeWhatsApp);
    }

    // Auto-fill rival, date and call-up time when jornada changes (primer equipo only)
    const jornadaSelect = document.getElementById('input-jornada');
    if (jornadaSelect) {
        jornadaSelect.addEventListener('change', () => {
            if (currentTeam === 'primer-equipo') {
                const val = jornadaSelect.value;
                if (!val || val === 'Supercopa' || val === 'Amistoso') {
                    document.getElementById('input-rival').value = '';
                    document.getElementById('input-schedule').value = '';
                    document.getElementById('input-callup-time').value = '';
                    document.getElementById('input-venue').value = 'Pabellón Camilo Cano';
                } else {
                    const jornadaNum = parseInt(val, 10);
                    const cal = PRIMER_EQUIPO_CALENDAR.find(c => c.jornada === jornadaNum);
                    if (cal) {
                        document.getElementById('input-rival').value = cal.rival;
                        const matchSchedule = cal.fecha + 'T17:00';
                        document.getElementById('input-schedule').value = matchSchedule;
                        document.getElementById('input-callup-time').value = calculateCallupTime(matchSchedule) || '15:45';
                        document.getElementById('input-venue').value = 'Pabellón Camilo Cano';
                    }
                }
            }
            queueCloudSync();
        });
    }

    // Auto-calculate call-up time (1h 15min before) whenever match schedule changes
    const scheduleInput = document.getElementById('input-schedule');
    if (scheduleInput) {
        scheduleInput.addEventListener('change', () => {
            const calculated = calculateCallupTime(scheduleInput.value);
            if (calculated) {
                document.getElementById('input-callup-time').value = calculated;
            }
            queueCloudSync();
        });
        scheduleInput.addEventListener('input', queueCloudSync);
    }

    // Auto-sync other text fields on typing/changes
    ['input-rival', 'input-callup-time', 'input-coach', 'input-observations'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
            el.addEventListener('input', queueCloudSync);
            el.addEventListener('change', queueCloudSync);
        }
    });

    ['input-venue', 'input-kit'].forEach(fieldId => {
        const el = document.getElementById(fieldId);
        if (el) {
            el.addEventListener('change', queueCloudSync);
        }
    });

    const whatsappBtn = document.getElementById('send-whatsapp-btn');
    if (whatsappBtn) whatsappBtn.addEventListener('click', sendWhatsApp);
    
    const tabPrimerEquipo = document.getElementById('tab-primer-equipo');
    const tabFilial = document.getElementById('tab-filial');
    const tabJuvenil = document.getElementById('tab-juvenil');
    const tabHistorial = document.getElementById('tab-historial');
    
    const workspaceGrid = document.getElementById('workspace-grid');
    const actionsBar = document.getElementById('actions-bar');
    const historyGrid = document.getElementById('history-grid');
    
    if (tabPrimerEquipo) {
        tabPrimerEquipo.addEventListener('click', () => {
            saveCurrentTeamDraftToLocal();
            currentTeam = 'primer-equipo';
            tabPrimerEquipo.classList.add('active');
            if (tabFilial) tabFilial.classList.remove('active');
            if (tabJuvenil) tabJuvenil.classList.remove('active');
            if (tabHistorial) tabHistorial.classList.remove('active');
            
            if (workspaceGrid) workspaceGrid.style.display = 'grid';
            if (actionsBar) actionsBar.style.display = 'flex';
            if (historyGrid) historyGrid.style.display = 'none';
            
            loadTeamData(currentTeam);
        });
    }
    
    if (tabFilial) {
        tabFilial.addEventListener('click', () => {
            saveCurrentTeamDraftToLocal();
            currentTeam = 'filial';
            tabFilial.classList.add('active');
            if (tabPrimerEquipo) tabPrimerEquipo.classList.remove('active');
            if (tabJuvenil) tabJuvenil.classList.remove('active');
            if (tabHistorial) tabHistorial.classList.remove('active');
            
            if (workspaceGrid) workspaceGrid.style.display = 'grid';
            if (actionsBar) actionsBar.style.display = 'flex';
            if (historyGrid) historyGrid.style.display = 'none';
            
            loadTeamData(currentTeam);
        });
    }

    if (tabJuvenil) {
        tabJuvenil.addEventListener('click', () => {
            saveCurrentTeamDraftToLocal();
            currentTeam = 'juvenil';
            tabJuvenil.classList.add('active');
            if (tabPrimerEquipo) tabPrimerEquipo.classList.remove('active');
            if (tabFilial) tabFilial.classList.remove('active');
            if (tabHistorial) tabHistorial.classList.remove('active');
            
            if (workspaceGrid) workspaceGrid.style.display = 'grid';
            if (actionsBar) actionsBar.style.display = 'flex';
            if (historyGrid) historyGrid.style.display = 'none';
            
            loadTeamData(currentTeam);
        });
    }

    if (tabHistorial) {
        tabHistorial.addEventListener('click', () => {
            tabHistorial.classList.add('active');
            if (tabPrimerEquipo) tabPrimerEquipo.classList.remove('active');
            if (tabFilial) tabFilial.classList.remove('active');
            if (tabJuvenil) tabJuvenil.classList.remove('active');
            
            if (workspaceGrid) workspaceGrid.style.display = 'none';
            if (actionsBar) actionsBar.style.display = 'none';
            if (historyGrid) historyGrid.style.display = 'grid';
            
            renderHistory();
        });
    }
    
    const saveHistoryBtn = document.getElementById('save-history-btn');
    if (saveHistoryBtn) saveHistoryBtn.addEventListener('click', saveCurrentToHistory);
    
    const clearHistoryBtn = document.getElementById('btn-clear-all-history');
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearAllHistory);
    
    const btnAddSearch = document.getElementById('btn-add-guest-search');
    if (btnAddSearch) {
        btnAddSearch.addEventListener('click', (e) => {
            e.preventDefault();
            addGuestPlayerToSquad();
        });
    }
    
    const inputSearch = document.getElementById('input-guest-search');
    if (inputSearch) {
        inputSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                addGuestPlayerToSquad();
            }
        });
    }
    
    const clearBtn = document.getElementById('clear-transcript-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const ta = document.getElementById('voice-transcript-output');
            if (ta) ta.value = '';
            const log = document.getElementById('nlp-status-log');
            if (log) log.innerHTML = '<div class="log-empty">Ninguna acción procesada todavía.</div>';
        });
    }
    
    const btnLogin = document.getElementById('btn-login');
    const inputPassword = document.getElementById('input-password');
    const loginError = document.getElementById('login-error');
    
    if (btnLogin && inputPassword) {
        const attemptLogin = () => {
            const pass = inputPassword.value;
            if (pass === PASS_ADMIN) {
                localStorage.setItem('laNuciaFS_auth', 'admin');
                window.location.reload();
            } else if (pass === PASS_RESTRICTED) {
                localStorage.setItem('laNuciaFS_auth', 'restricted');
                window.location.reload();
            } else {
                if (loginError) loginError.style.display = 'block';
            }
        };
        
        btnLogin.addEventListener('click', attemptLogin);
        inputPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') attemptLogin();
        });
    }
    
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            localStorage.removeItem('laNuciaFS_auth');
            window.location.reload();
        });
    }
    
    const btnCancelEdit = document.getElementById('btn-cancel-edit');
    if (btnCancelEdit) {
        btnCancelEdit.addEventListener('click', () => {
            document.getElementById('edit-position-overlay').style.display = 'none';
            currentlyEditingPlayerId = null;
        });
    }
    
    const btnSaveEdit = document.getElementById('btn-save-edit');
    if (btnSaveEdit) {
        btnSaveEdit.addEventListener('click', () => {
            if (currentlyEditingPlayerId) {
                const newPos = document.getElementById('edit-position-select').value;
                const player = squadState.find(p => p.id === currentlyEditingPlayerId);
                if (player) {
                    player.position = newPos;
                    // Also update isGoalkeeper just in case
                    player.isGoalkeeper = (newPos === 'Portero');
                    saveCustomPosition(currentlyEditingPlayerId, newPos);
                    renderPlayerList();
                    updateTacticalView();
                }
            }
            document.getElementById('edit-position-overlay').style.display = 'none';
            currentlyEditingPlayerId = null;
        });
    }
}

// Run app initialization when script loads
function checkAuthAndInit() {
    userRole = localStorage.getItem('laNuciaFS_auth');
    
    if (!userRole) {
        // Show login, hide app
        document.getElementById('login-overlay').style.display = 'flex';
        document.getElementById('main-app-container').style.display = 'none';
        setupEventListeners();
        return;
    }
    
    // User is authenticated
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('main-app-container').style.display = 'block';
    
    if (userRole === 'restricted') {
        const tabPrimerEquipo = document.getElementById('tab-primer-equipo');
        if (tabPrimerEquipo) tabPrimerEquipo.style.display = 'none';
        
        currentTeam = 'filial';
        document.getElementById('tab-filial').classList.add('active');
        document.getElementById('tab-primer-equipo').classList.remove('active');
    }
    
    initApp();
}
// One-time data migration: fix player names in saved history and purge deleted items
function migrateHistoryPlayerNames() {
    const renames = [
        { from: 'Alberto Jose Madagascar Casanova', to: 'Alberto Madagascar Casanova' }
    ];
    
    const historyStr = localStorage.getItem('laNuciaFS_history');
    if (!historyStr) return;
    
    let changed = false;
    let history;
    try { history = JSON.parse(historyStr); } catch(e) { return; }
    if (!Array.isArray(history)) return;
    
    const deletedIds = getDeletedHistoryIds();
    const beforeCount = history.length;
    history = history.filter(record => record && !deletedIds.includes(record.id) && !record.rival?.toLowerCase().includes('manresa'));
    if (history.length !== beforeCount) {
        changed = true;
    }
    
    history.forEach(record => {
        // Fix team attribution specifically:
        // - Hercules San Vicente Sub-23 -> Juvenil
        // - Hercules San Vicente 3ª -> Filial
        if (record.rival) {
            const rivalLower = record.rival.toLowerCase();
            if ((rivalLower.includes('hercules') || rivalLower.includes('san vicente')) && (rivalLower.includes('sub 23') || rivalLower.includes('sub-23') || rivalLower.includes('sub23'))) {
                if (record.team !== 'juvenil') {
                    record.team = 'juvenil';
                    changed = true;
                }
            } else if ((rivalLower.includes('hercules') || rivalLower.includes('san vicente')) && (rivalLower.includes('3ª') || rivalLower.includes('3a') || rivalLower.includes('tercera'))) {
                if (record.team !== 'filial') {
                    record.team = 'filial';
                    changed = true;
                }
            }
        }

        if (!record.squadState) return;
        record.squadState.forEach(player => {
            renames.forEach(r => {
                if (player.name === r.from) {
                    player.name = r.to;
                    changed = true;
                }
            });
        });
    });
    
    if (changed) {
        saveHistory(history);
        console.log('Historial actualizado: datos corregidos.');
        if (typeof pushCloudData === 'function') {
            pushCloudData();
        }
    }
}

// Disable browser remembering scroll position so the page always opens at the top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('DOMContentLoaded', () => {
    window.scrollTo(0, 0);
    migrateHistoryPlayerNames();
    checkAuthAndInit();
});

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});
