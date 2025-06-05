const FloodAlert = {
    // Dados simulados
    areas: [
        { nome: 'Zona Norte', populacao: 15000, risco: 'alto' },
        { nome: 'Centro', populacao: 25000, risco: 'medio' },
        { nome: 'Zona Sul', populacao: 20000, risco: 'baixo' }
    ],
    
    // Configurações
    config: {
        alertDelay: 1000,
        animationDuration: 300,
        notificationDuration: 3000
    }
};

// ===== UTILITÁRIOS =====
const Utils = {
    // Mostrar notificação
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remover após o tempo configurado
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, FloodAlert.config.notificationDuration);
    },
    
    // Adicionar classe de loading
    addLoading(element) {
        element.classList.add('loading');
        element.disabled = true;
    },
    
    // Remover classe de loading
    removeLoading(element) {
        element.classList.remove('loading');
        element.disabled = false;
    },
    
    // Validar email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Validar telefone
    validatePhone(phone) {
        const re = /^[\(\)\s\-\+\d]{10,}$/;
        return re.test(phone);
    },
    
    // Formatar telefone
    formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phone;
    }
};

// ===== FUNÇÕES PRINCIPAIS =====

// Simular alerta geral
function simularAlerta() {
    const button = event.target;
    Utils.addLoading(button);
    
    setTimeout(() => {
        Utils.removeLoading(button);
        Utils.showNotification('Simulação de alerta iniciada! Os moradores serão notificados.', 'success');
        
        // Simular progresso de envio
        let progress = 0;
        const interval = setInterval(() => {
            progress += 25;
            if (progress <= 100) {
                console.log(`Progresso do alerta: ${progress}%`);
            }
            if (progress >= 100) {
                clearInterval(interval);
                Utils.showNotification('Todos os moradores foram notificados!', 'success');
            }
        }, 500);
    }, FloodAlert.config.alertDelay);
}

// Enviar alerta para zona específica
function enviarAlerta(zona) {
    const button = event.target;
    Utils.addLoading(button);
    
    // Encontrar dados da área
    const area = FloodAlert.areas.find(a => a.nome === zona);
    
    setTimeout(() => {
        Utils.removeLoading(button);
        
        if (area) {
            Utils.showNotification(
                `Alerta enviado para ${area.populacao.toLocaleString()} moradores da ${zona}!`, 
                'warning'
            );
            
            // Log detalhado
            console.log(`Alerta enviado:`, {
                zona: zona,
                populacao: area.populacao,
                risco: area.risco,
                timestamp: new Date().toISOString()
            });
            
            // Simular evacuação se for alto risco
            if (area.risco === 'alto') {
                setTimeout(() => {
                    Utils.showNotification('Evacuação necessária! Rotas de fuga ativadas.', 'error');
                }, 2000);
            }
        } else {
            Utils.showNotification('Erro: Zona não encontrada!', 'error');
        }
    }, FloodAlert.config.alertDelay);
}

// ===== GERENCIAMENTO DE FORMULÁRIOS =====
class FormManager {
    constructor() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Formulário de cadastro
        const cadastroForm = document.getElementById('cadastroForm');
        if (cadastroForm) {
            cadastroForm.addEventListener('submit', this.handleCadastroSubmit.bind(this));
            
            // Validação em tempo real
            const inputs = cadastroForm.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('blur', this.validateInput.bind(this));
                input.addEventListener('input', this.formatInput.bind(this));
            });
        }
    }
    
    handleCadastroSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Validar dados
        if (!this.validateFormData(data)) {
            Utils.showNotification('Por favor, corrija os erros no formulário.', 'error');
            return;
        }
        
        // Simular envio
        const submitButton = e.target.querySelector('button[type="submit"]');
        Utils.addLoading(submitButton);
        
        setTimeout(() => {
            Utils.removeLoading(submitButton);
            
            // Salvar no localStorage (simulação)
            this.saveUserData(data);
            
            Utils.showNotification('Cadastro realizado com sucesso!', 'success');
            e.target.reset();
            
            // Log dos dados
            console.log('Usuário cadastrado:', data);
        }, 2000);
    }
    
    validateFormData(data) {
        let isValid = true;
        
        // Validar nome
        if (!data.nome || data.nome.length < 2) {
            isValid = false;
        }
        
        // Validar telefone
        if (!data.telefone || !Utils.validatePhone(data.telefone)) {
            isValid = false;
        }
        
        // Validar endereço
        if (!data.endereco || data.endereco.length < 5) {
            isValid = false;
        }
        
        return isValid;
    }
    
    validateInput(e) {
        const input = e.target;
        const value = input.value.trim();
        
        // Remover classes de erro anteriores
        input.classList.remove('border-red-500', 'border-green-500');
        
        let isValid = true;
        
        switch (input.type) {
            case 'text':
                if (input.labels[0].textContent.includes('Nome')) {
                    isValid = value.length >= 2;
                } else {
                    isValid = value.length >= 5;
                }
                break;
            case 'tel':
                isValid = Utils.validatePhone(value);
                break;
            case 'email':
                isValid = Utils.validateEmail(value);
                break;
        }
        
        // Aplicar classes visuais
        if (value) {
            input.classList.add(isValid ? 'border-green-500' : 'border-red-500');
        }
    }
    
    formatInput(e) {
        const input = e.target;
        
        if (input.type === 'tel') {
            input.value = Utils.formatPhone(input.value);
        }
    }
    
    saveUserData(data) {
        const users = JSON.parse(localStorage.getItem('floodAlertUsers') || '[]');
        users.push({
            ...data,
            id: Date.now(),
            registeredAt: new Date().toISOString()
        });
        localStorage.setItem('floodAlertUsers', JSON.stringify(users));
    }
}

// ===== NAVEGAÇÃO SUAVE =====
class Navigation {
    constructor() {
        this.setupSmoothScroll();
        this.setupActiveLinks();
    }
    
    setupSmoothScroll() {
        const navLinks = document.querySelectorAll('nav span[class*="cursor-pointer"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const text = e.target.textContent.toLowerCase();
                const targetId = text === 'home' ? 'home' : text;
                const target = document.getElementById(targetId);
                
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    setupActiveLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav span[class*="cursor-pointer"]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('text-primary');
                link.classList.add('text-gray-600');
                
                if (link.textContent.toLowerCase() === current) {
                    link.classList.remove('text-gray-600');
                    link.classList.add('text-primary');
                }
            });
        });
    }
}

// ===== ANIMAÇÕES =====
class Animations {
    constructor() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
    }
    
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos que devem animar
        const animatedElements = document.querySelectorAll('.bg-white, .grid > div');
        animatedElements.forEach(el => observer.observe(el));
    }
    
    setupHoverEffects() {
        // Adicionar efeitos hover aos cards
        const cards = document.querySelectorAll('.bg-white.rounded-lg');
        cards.forEach(card => {
            card.classList.add('card-hover');
        });
        
        // Adicionar efeitos aos links de navegação
        const navLinks = document.querySelectorAll('nav span[class*="cursor-pointer"]');
        navLinks.forEach(link => {
            link.classList.add('nav-link-hover');
        });
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌊 FloodAlert System Initialized');
    
    // Inicializar módulos
    new FormManager();
    new Navigation();
    new Animations();
    
    // Adicionar animação inicial
    document.body.classList.add('animate-fade-in');
    
    // Log de estatísticas
    console.log('📊 Áreas monitoradas:', FloodAlert.areas.length);
    console.log('👥 População total:', FloodAlert.areas.reduce((sum, area) => sum + area.populacao, 0).toLocaleString());
});

