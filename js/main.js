document.addEventListener("DOMContentLoaded", () => {
    
    // --- Utility Functions ---
    
    // Lista negra de palabras inapropiadas
    const blacklist = ['pene', 'vagina', 'puta', 'puto', 'verga', 'mierda', 'cabron', 'pendejo', 'zorra', 'perra'];

    // Check if string is only letters and spaces, minimum 3 chars or 'sol' and no bad words
    const isValidName = (name) => {
        const trimmed = name.trim();
        const lowerName = trimmed.toLowerCase();
        
        // Verificar lista negra
        for (let word of blacklist) {
            if (lowerName.includes(word)) return false;
        }

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(trimmed)) return false;
        if (lowerName === 'sol') return true;
        return trimmed.length >= 3;
    };

    // Check if email ends with .com
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email) && email.toLowerCase().endsWith('.com');
    };

    // Check if phone is exactly 10 digits and not repetitive
    const isValidPhone = (phone) => {
        if (!/^\d{10}$/.test(phone)) return false;
        // Check for repeating digits like 0000000000, 1111111111
        const firstDigit = phone[0];
        if (phone.split('').every(char => char === firstDigit)) return false;
        return true;
    };

    // Set invalid state
    const setInvalid = (input, messageId, message) => {
        input.classList.add('is-invalid-custom');
        const msgElement = document.getElementById(messageId);
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.style.display = 'block';
        }
    };

    // Clear invalid state
    const setValid = (input, messageId) => {
        input.classList.remove('is-invalid-custom');
        const msgElement = document.getElementById(messageId);
        if (msgElement) {
            msgElement.style.display = 'none';
        }
    };


    // --- Form Handlers ---

    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const emailInput = document.getElementById('email');
            const passInput = document.getElementById('password');

            // Validate Email
            if (!isValidEmail(emailInput.value)) {
                setInvalid(emailInput, 'emailError', 'El correo debe ser válido y terminar en .com');
                isValid = false;
            } else {
                setValid(emailInput, 'emailError');
            }

            // Validate Password
            if (passInput.value.length < 6) {
                setInvalid(passInput, 'passError', 'La contraseña debe tener al menos 6 caracteres');
                isValid = false;
            } else {
                setValid(passInput, 'passError');
            }

            if (isValid) {
                // Redirect based on role
                const urlParams = new URLSearchParams(window.location.search);
                const role = urlParams.get('role');
                if (role === 'vet') {
                    window.location.href = 'vet_dashboard.html';
                } else {
                    window.location.href = 'owner_dashboard.html';
                }
            }
        });
    }

    // Register Form Validation
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const passInput = document.getElementById('password');

            // Name
            if (!isValidName(nameInput.value)) {
                setInvalid(nameInput, 'nameError', 'Ingrese un nombre válido (solo letras)');
                isValid = false;
            } else {
                setValid(nameInput, 'nameError');
            }

            // Email
            if (!isValidEmail(emailInput.value)) {
                setInvalid(emailInput, 'emailError', 'El correo debe terminar en .com');
                isValid = false;
            } else {
                setValid(emailInput, 'emailError');
            }

            // Phone
            if (!isValidPhone(phoneInput.value)) {
                setInvalid(phoneInput, 'phoneError', 'Debe ser de 10 dígitos y no ser números repetidos (ej. 0000000000)');
                isValid = false;
            } else {
                setValid(phoneInput, 'phoneError');
            }

            // Password
            if (passInput.value.length < 6) {
                setInvalid(passInput, 'passError', 'Mínimo 6 caracteres');
                isValid = false;
            } else {
                setValid(passInput, 'passError');
            }

            if (isValid) {
                const urlParams = new URLSearchParams(window.location.search);
                const role = urlParams.get('role');
                alert("Registro exitoso. Redirigiendo al login...");
                window.location.href = `login.html?role=${role}`;
            }
        });
    }

    // Add Pet Form Validation (Vet Dashboard)
    const addPetForm = document.getElementById('addPetForm');
    if (addPetForm) {
        addPetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const petName = document.getElementById('petName');
            
            if (!isValidName(petName.value)) {
                setInvalid(petName, 'petNameError', 'Ingrese un nombre adecuado (Minimo 3 letras)');
                isValid = false;
            } else {
                setValid(petName, 'petNameError');
            }

            if (isValid) {
                alert("Mascota agregada exitosamente.");
                // Close modal (Bootstrap)
                const modalElement = document.getElementById('addPetModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                addPetForm.reset();
            }
        });
    }

    // --- V2 App Real Logic ---

    // Interactive Tasks (To-Do List)
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Prevent toggling if clicked on a button inside
            if(e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
            
            const checkbox = this.querySelector('.form-check-input');
            if (e.target !== checkbox) {
                checkbox.checked = !checkbox.checked;
            }
            
            if (checkbox.checked) {
                this.classList.add('completed');
            } else {
                this.classList.remove('completed');
            }
        });
    });

    // Chart.js Setup for Owner Dashboard (Weight Timeline)
    const weightChartCtx = document.getElementById('weightChart');
    if (weightChartCtx) {
        new Chart(weightChartCtx, {
            type: 'line',
            data: {
                labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Peso (kg)',
                    data: [28.5, 29.0, 29.5, 30.0, 30.2, 30.5, 30.5],
                    borderColor: '#008080', // Primary color
                    backgroundColor: 'rgba(0, 128, 128, 0.1)',
                    borderWidth: 3,
                    pointBackgroundColor: '#004D40',
                    pointRadius: 5,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        suggestedMin: 25,
                        suggestedMax: 35
                    }
                }
            }
        });
    }

    // --- V3 Responsive Logic ---
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const sidebar = document.getElementById('sidebar');
    let overlay = document.getElementById('sidebarOverlay');

    // Create overlay if it doesn't exist
    if (hamburgerBtn && sidebar && !overlay) {
        overlay = document.createElement('div');
        overlay.id = 'sidebarOverlay';
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (hamburgerBtn && sidebar && overlay) {
        const toggleSidebar = () => {
            sidebar.classList.toggle('show');
            overlay.classList.toggle('show');
        };

        hamburgerBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }

    // --- V5 Lógica de Formularios y Modales ---
    
    // Especie "Otro"
    const petSpeciesSelect = document.getElementById('petSpecies');
    const specifySpeciesContainer = document.getElementById('specifySpeciesContainer');
    if (petSpeciesSelect && specifySpeciesContainer) {
        petSpeciesSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Otro') {
                specifySpeciesContainer.style.display = 'block';
            } else {
                specifySpeciesContainer.style.display = 'none';
            }
        });
    }

    // Buscador de Pacientes
    const searchPatientInput = document.getElementById('searchPatientInput');
    const patientsTableBody = document.getElementById('patientsTableBody');
    if (searchPatientInput && patientsTableBody) {
        searchPatientInput.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = patientsTableBody.getElementsByTagName('tr');
            
            Array.from(rows).forEach(row => {
                const textContent = row.textContent.toLowerCase();
                if (textContent.includes(query)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // --- Nuevas funcionalidades avanzadas ---
    
    // Inyección de Modales y Modo Oscuro
    const initAdvancedFeatures = () => {
        // 1. Modo Oscuro
        const savedTheme = localStorage.getItem('vetcare-theme');
        if (savedTheme === 'dark') document.body.classList.add('dark-mode');

        // Insertar botón de tema en los headers
        const headers = document.querySelectorAll('header > div:last-child');
        headers.forEach(header => {
            const btn = document.createElement('button');
            btn.className = 'theme-toggle-btn ms-3 align-middle';
            btn.innerHTML = document.body.classList.contains('dark-mode') ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
            btn.title = "Alternar Modo Oscuro";
            btn.onclick = () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('vetcare-theme', isDark ? 'dark' : 'light');
                document.querySelectorAll('.theme-toggle-btn').forEach(b => {
                    b.innerHTML = isDark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
                });
            };
            header.appendChild(btn);
        });

        // 2. Inyección de Modales Genéricos
        const modalsHTML = `
            <!-- Modal de Perfil -->
            <div class="modal fade" id="genericProfileModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-primary-custom text-white border-0">
                            <h5 class="modal-title"><i class="bi bi-person-circle me-2"></i>Mi Perfil</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form id="profileForm">
                                <div class="mb-3">
                                    <label class="form-label">Nombre Completo</label>
                                    <input type="text" class="form-control" value="Usuario Actual">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Correo Electrónico</label>
                                    <input type="email" class="form-control" value="contacto@vetcare.com">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Teléfono</label>
                                    <input type="text" class="form-control" value="555-0192">
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Nueva Contraseña</label>
                                    <input type="password" class="form-control" placeholder="••••••••">
                                </div>
                                <button type="submit" class="btn btn-primary-custom w-100">Guardar Cambios</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal Dinámico (Agendar/Editar) -->
            <div class="modal fade" id="genericActionModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content border-0 shadow">
                        <div class="modal-header bg-secondary-custom text-white border-0">
                            <h5 class="modal-title" id="actionModalTitle">Acción</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4" id="actionModalBody">
                            <!-- Inyectado vía JS -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalsHTML;
        document.body.appendChild(modalContainer);

        // Submit Perfil
        document.getElementById('profileForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Perfil actualizado con éxito!');
            bootstrap.Modal.getInstance(document.getElementById('genericProfileModal')).hide();
        });
    };
    initAdvancedFeatures();

    let cartCount = 0;
    
    // --- Conexión a Base de Datos (API) ---
    let dbPatients = [];

    const loadDatabaseData = async () => {
        // Cargar Pacientes para los modales
        try {
            const res = await fetch('api/patients.php');
            if(res.ok) {
                dbPatients = await res.json();
            }
        } catch(e) { console.error("Error cargando pacientes:", e); }

        // Cargar Inventario si estamos en la página
        const medTable = document.getElementById('medicinesTableBody');
        const suppTable = document.getElementById('suppliesTableBody');
        const shopTable = document.getElementById('shopTableBody');
        
        if (medTable || suppTable || shopTable) {
            try {
                const res = await fetch('api/inventory.php');
                if (res.ok) {
                    const items = await res.json();
                    if(medTable) medTable.innerHTML = '';
                    if(suppTable) suppTable.innerHTML = '';
                    if(shopTable) shopTable.innerHTML = '';

                    items.forEach(item => {
                        let badgeClass = item.status_badge === 'Óptimo' ? 'bg-success' : (item.status_badge === 'Nivel Bajo' ? 'bg-warning text-dark' : 'bg-danger');
                        let btnClass = item.status_badge === 'Óptimo' ? 'btn-outline-secondary' : 'btn-outline-warning text-dark';
                        let btnIcon = item.status_badge === 'Óptimo' ? '<i class="bi bi-pencil"></i>' : 'Hacer Pedido';
                        let rowClass = item.status_badge === 'Stock Crítico' ? 'table-danger' : (item.status_badge === 'Nivel Bajo' ? 'table-warning' : '');

                        const tr = document.createElement('tr');
                        if(rowClass) tr.className = rowClass;
                        tr.innerHTML = `
                            <td class="text-muted">${item.code}</td>
                            <td class="fw-bold">${item.name}</td>
                            <td>${item.category}</td>
                            <td class="fw-bold text-success">${item.stock} ${item.unit}</td>
                            <td><span class="badge ${badgeClass} rounded-pill">${item.status_badge}</span></td>
                            <td><button class="btn btn-sm ${btnClass}">${btnIcon}</button></td>
                        `;
                        // Insertar en la tabla correcta según categoría
                        if(item.category === 'Alimento' || item.category === 'Accesorios' && shopTable) shopTable.appendChild(tr);
                        else if(item.category === 'Material Médico' || item.category === 'Soluciones' && suppTable) suppTable.appendChild(tr);
                        else if(medTable) medTable.appendChild(tr);
                    });
                }
            } catch(e) { console.error("Error cargando inventario:", e); }
        }
    };
    
    // Iniciar carga de DB
    loadDatabaseData();

    // Delegación de eventos principal
    document.body.addEventListener('click', (e) => {
        
        // 1. Enlaces # y Mi Perfil
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') === '#') {
            e.preventDefault();
            if (link.textContent.includes('Mi Perfil') || link.textContent.includes('Ajustes')) {
                const modal = new bootstrap.Modal(document.getElementById('genericProfileModal'));
                modal.show();
            }
        }

        // 2. Agendar Cita
        const btnAgendar = e.target.closest('.btn-primary-custom');
        if (btnAgendar && btnAgendar.textContent.includes('Agendar Cita')) {
            const title = document.getElementById('actionModalTitle');
            const body = document.getElementById('actionModalBody');
            title.innerHTML = '<i class="bi bi-calendar-plus me-2"></i>Agendar Nueva Cita';
            
            // Construir opciones de pacientes desde DB si existen, sino predeterminados
            let options = dbPatients.length > 0 
                ? dbPatients.map(p => `<option value="${p.name}">${p.name}</option>`).join('')
                : `<option value="Max">Max</option><option value="Luna">Luna</option>`;

            body.innerHTML = `
                <form id="scheduleForm">
                    <div class="mb-3">
                        <label class="form-label">Paciente / Mascota</label>
                        <select class="form-select" id="schedPet">${options}</select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Fecha y Hora</label>
                        <input type="datetime-local" class="form-control" id="schedDate" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Motivo</label>
                        <textarea class="form-control" rows="2" id="schedReason" placeholder="Ej. Revisión anual" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary-custom w-100">Confirmar Cita</button>
                </form>
            `;
            const modal = new bootstrap.Modal(document.getElementById('genericActionModal'));
            modal.show();
            
            document.getElementById('scheduleForm').addEventListener('submit', async (ev) => {
                ev.preventDefault();
                const btnSubmit = ev.target.querySelector('button[type="submit"]');
                btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Guardando...';
                
                const data = {
                    pet_name: document.getElementById('schedPet').value,
                    date_time: document.getElementById('schedDate').value,
                    reason: document.getElementById('schedReason').value
                };

                try {
                    const res = await fetch('api/appointments.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });
                    if (res.ok) {
                        alert('¡Cita agendada correctamente en la Base de Datos!');
                        modal.hide();
                    } else {
                        alert('Error al agendar la cita.');
                    }
                } catch(e) { console.error(e); alert('Error de conexión.'); }
                btnSubmit.innerHTML = 'Confirmar Cita';
            });
        }

        // 3. Botones de Edición (Lápiz en las tablas)
        const btnEdit = e.target.closest('.btn-outline-secondary');
        if (btnEdit && btnEdit.querySelector('.bi-pencil')) {
            const row = btnEdit.closest('tr');
            if (row) {
                const cells = row.querySelectorAll('td');
                const code = cells[0].textContent.trim();
                const name = cells[1].textContent.trim();
                const title = document.getElementById('actionModalTitle');
                const body = document.getElementById('actionModalBody');
                title.innerHTML = '<i class="bi bi-pencil-square me-2"></i>Editar Registro DB';
                body.innerHTML = `
                    <form id="editForm">
                        <div class="mb-3">
                            <label class="form-label">Identificador / Código</label>
                            <input type="text" class="form-control" id="editCode" value="${code}" readonly>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editName" value="${name}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="editStatus">
                                <option>Óptimo</option>
                                <option>Nivel Bajo</option>
                                <option>Stock Crítico</option>
                            </select>
                        </div>
                        <button type="submit" class="btn btn-secondary w-100">Guardar en Base de Datos</button>
                    </form>
                `;
                const modal = new bootstrap.Modal(document.getElementById('genericActionModal'));
                modal.show();

                document.getElementById('editForm').addEventListener('submit', async (ev) => {
                    ev.preventDefault();
                    const data = {
                        action: 'update',
                        code: document.getElementById('editCode').value,
                        name: document.getElementById('editName').value,
                        status: document.getElementById('editStatus').value
                    };
                    try {
                        const res = await fetch('api/inventory.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(data)
                        });
                        if (res.ok) {
                            alert('Cambios guardados en la BD. Recargando datos...');
                            modal.hide();
                            loadDatabaseData(); // Recargar tabla
                        }
                    } catch(e) { alert('Error de conexión.'); }
                });
            }
        }

        // 4. Tienda: Añadir
        const btnAdd = e.target.closest('.btn-primary-custom');
        if (btnAdd && btnAdd.innerHTML.includes('Añadir')) {
            cartCount++;
            const badge = document.querySelector('header .btn-outline-primary .badge');
            if (badge) badge.textContent = cartCount;
            const originalText = btnAdd.innerHTML;
            btnAdd.innerHTML = '<i class="bi bi-check-circle-fill me-1"></i> Añadido';
            btnAdd.classList.add('btn-success');
            setTimeout(() => { btnAdd.innerHTML = originalText; btnAdd.classList.remove('btn-success'); }, 1000);
        }

        // 5. Cartilla y Servicios Rápidos
        const btnCartilla = e.target.closest('button');
        if (btnCartilla && btnCartilla.textContent.includes('Ver Cartilla Digital')) {
            // Intentar encontrar el nombre de la mascota en la página (Dueño)
            const petNameEl = document.querySelector('.card-title.text-accent-color');
            let patientInfoText = petNameEl ? petNameEl.textContent.trim() : "Max";
            let matchedPatient = null;
            
            const patientsList = dbPatients.length > 0 ? dbPatients : mockPatients;
            for (let p of patientsList) {
                if (patientInfoText.includes(p.name)) {
                    matchedPatient = p; break;
                }
            }

            const title = document.getElementById('actionModalTitle');
            const body = document.getElementById('actionModalBody');
            
            if (matchedPatient) {
                title.innerHTML = `<i class="bi bi-journal-medical me-2"></i>Cartilla Digital - ${matchedPatient.name}`;
                body.innerHTML = `
                    <div class="text-center mb-4">
                        <img src="images/dog_avatar.png" class="rounded-circle shadow-sm mb-3" style="width: 80px; height: 80px; object-fit: cover;" alt="${matchedPatient.name}">
                        <h5>${matchedPatient.name}</h5>
                        <span class="badge bg-success">Saludable</span>
                    </div>
                    <div class="text-start p-3 bg-light rounded shadow-sm w-100 border">
                        <p class="mb-2"><strong><i class="bi bi-tag text-primary-custom"></i> Especie:</strong> ${matchedPatient.species}</p>
                        <p class="mb-2"><strong><i class="bi bi-info-circle text-primary-custom"></i> Raza:</strong> ${matchedPatient.breed}</p>
                        <p class="mb-2"><strong><i class="bi bi-calendar text-primary-custom"></i> Edad:</strong> ${matchedPatient.age}</p>
                        <p class="mb-2"><strong><i class="bi bi-speedometer2 text-primary-custom"></i> Peso:</strong> ${matchedPatient.weight}</p>
                        <hr>
                        <h6 class="text-accent-color mt-3"><i class="bi bi-file-earmark-medical"></i> Expediente y Notas</h6>
                        <p class="mb-0 text-muted">${matchedPatient.history}</p>
                    </div>
                    <div class="mt-4 text-center">
                        <button class="btn btn-outline-primary btn-sm" onclick="alert('Descargando PDF...')"><i class="bi bi-download"></i> Descargar Historial</button>
                    </div>
                `;
            } else {
                title.innerHTML = `<i class="bi bi-journal-medical me-2"></i>Cartilla Digital`;
                body.innerHTML = "<p>No se encontraron detalles para este paciente.</p>";
            }

            const modal = new bootstrap.Modal(document.getElementById('genericActionModal'));
            modal.show();
        }

        const btnService = e.target.closest('.btn-light');
        if (btnService) {
            if (btnService.textContent.includes('Solicitar Baño') && confirm('¿Confirmar baño y estética?')) alert('✅ Solicitud enviada a la clínica.');
            if (btnService.textContent.includes('Comprar Croquetas') && confirm('¿Confirmar pedido de croquetas?')) alert('🚚 Pedido confirmado.');
        }

        // 6. Inventario: Hacer Pedido
        const btnOrder = e.target.closest('.btn-outline-danger, .btn-outline-warning');
        if (btnOrder && btnOrder.closest('tr')) {
            const productName = btnOrder.closest('tr').querySelectorAll('td')[1].textContent.trim();
            alert(`⚠️ Generando orden de compra / revisión de inventario para:\n\n📦 ${productName}`);
        }

        // 7. Ver Ficha Modal
        const btnVerFicha = e.target.closest('[data-bs-target="#historyModal"]');
        if (btnVerFicha) {
            const row = btnVerFicha.closest('.card');
            const patientNameEl = row.querySelector('.text-secondary');
            let patientInfoText = patientNameEl ? patientNameEl.textContent.trim() : "";
            let matchedPatient = null;
            
            // Usar dbPatients en vez de mockPatients
            const patientsList = dbPatients.length > 0 ? dbPatients : mockPatients;
            for (let p of patientsList) {
                // nameMatch ya no existe en la BD, usamos el name
                if (patientInfoText.includes(p.name)) {
                    matchedPatient = p; break;
                }
            }

            const modal = document.getElementById('historyModal');
            if (modal) {
                const mTitle = modal.querySelector('.modal-title');
                const mBodyTitle = modal.querySelector('h4');
                const mDesc = modal.querySelector('p.text-muted');
                
                if (matchedPatient) {
                    if (mTitle) mTitle.textContent = `Historial Clínico - ${matchedPatient.name}`;
                    if (mBodyTitle) mBodyTitle.textContent = matchedPatient.name;
                    if (mDesc) {
                        mDesc.innerHTML = `
                            <div class="text-start d-inline-block mt-3 p-3 bg-light rounded shadow-sm w-100">
                                <p class="mb-2"><strong><i class="bi bi-tag"></i> Especie:</strong> ${matchedPatient.species}</p>
                                <p class="mb-2"><strong><i class="bi bi-info-circle"></i> Raza:</strong> ${matchedPatient.breed}</p>
                                <p class="mb-2"><strong><i class="bi bi-calendar"></i> Edad:</strong> ${matchedPatient.age}</p>
                                <p class="mb-2"><strong><i class="bi bi-speedometer2"></i> Peso:</strong> ${matchedPatient.weight}</p>
                                <hr>
                                <p class="mb-0"><strong><i class="bi bi-journal-medical"></i> Notas Clínicas:</strong> ${matchedPatient.history}</p>
                            </div>
                        `;
                    }
                } else {
                    if (mTitle) mTitle.textContent = `Historial Clínico`;
                    if (mBodyTitle) mBodyTitle.textContent = "Paciente";
                    if (mDesc) mDesc.innerHTML = "No se encontraron detalles adicionales para este paciente en la base de datos.";
                }
            }
        }
        // 8. Funciones No Programadas (Fallbacks de Desarrollo)
        const btn = e.target.closest('button');
        if (btn) {
            const btnText = btn.textContent.trim();
            if (
                btn.id === 'saveApptBtn' || 
                btn.id === 'saveProductBtn' || 
                btn.id === 'savePetBtn' || 
                btnText === 'Semana' || 
                btnText === 'Mes' || 
                btnText === 'Cambiar Foto' || 
                btnText === 'Eliminar Foto' ||
                btn.title === 'Ver Historial' ||
                btnText.includes('Descargar PDF') ||
                btnText.includes('Descargar') ||
                btnText.includes('Exportar')
            ) {
                alert(`[Módulo en Desarrollo] La acción que intentas realizar (${btnText || btn.title}) es solo visual por el momento y no está conectada a la Base de Datos.`);
            }
        }

    });

    // 8. Eventos de los Selects (Simular filtros de días/meses)
    document.querySelectorAll('select.form-select').forEach(select => {
        select.addEventListener('change', (e) => {
            // Ignorar los selects que son parte de formularios (tienen required o id específico)
            if(e.target.closest('form')) return;
            
            // Simular recarga de datos al cambiar filtros (ej. Últimos 6 meses -> Este Año)
            console.log("Filtro cambiado:", e.target.value);
            // Dar un pequeño feedback visual
            e.target.style.opacity = '0.5';
            setTimeout(() => {
                e.target.style.opacity = '1';
            }, 300);
        });
    });

});
