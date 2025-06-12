        // Import Three.js from a CDN
        import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';

        // === Three.js Scene Setup ===
        let scene, camera, renderer, particles;
        let mouseX = 0, mouseY = 0;

        const container = document.getElementById('canvas-container');

        function init() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 300; // Move camera back to see the particles

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const particleCount = 2000;
            const positions = new Float32Array(particleCount * 3);
            
            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                positions[i3] = (Math.random() - 0.5) * 1000; // x
                positions[i3 + 1] = (Math.random() - 0.5) * 1000; // y
                positions[i3 + 2] = (Math.random() - 0.5) * 1000; // z
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            
            const material = new THREE.PointsMaterial({
                color: 0xffffff, // White particles
                size: 0.8, // Small particle size
                blending: THREE.AdditiveBlending,
                transparent: true,
                opacity: 0.6
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            document.addEventListener('mousemove', onDocumentMouseMove, false);
            window.addEventListener('resize', onWindowResize, false);
        }

        function onWindowResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - container.clientWidth / 2);
            mouseY = (event.clientY - container.clientHeight / 2);
        }

        function animate() {
            requestAnimationFrame(animate);

            // Animate particles
            const positions = particles.geometry.attributes.position.array;
            let i = 0;
            for(let p = 0; p < positions.length; p+=3) {
                positions[i+2] += 0.1; // Move particle along Z axis
                
                // If particle is too close, reset its position to the back
                if (positions[i+2] > camera.position.z) {
                     positions[i+2] = -500;
                }
                i+=3;
            }
            particles.geometry.attributes.position.needsUpdate = true;


            // Parallax effect for camera
            camera.position.x += (mouseX * 0.001 - camera.position.x) * 0.02;
            camera.position.y += (-mouseY * 0.001 - camera.position.y) * 0.02;
            camera.lookAt(scene.position);
            
            renderer.render(scene, camera);
        }

        // === Initialize 3D Scene ===
        init();
        animate();

        // === Mobile Menu Toggle ===
        const menuToggle = document.getElementById('menu-toggle');
        const mobileMenu = document.getElementById('mobile-menu');
        const openIcon = document.getElementById('menu-icon-open');
        const closeIcon = document.getElementById('menu-icon-close');

        menuToggle.addEventListener('click', () => {
            const isHidden = mobileMenu.classList.contains('hidden');
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenu.classList.add('flex');
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
            }
            openIcon.classList.toggle('hidden');
            closeIcon.classList.toggle('hidden');
        });

        // Close menu when a link is clicked
        mobileMenu.addEventListener('click', (e) => {
            if(e.target.tagName === 'A') {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('flex');
                openIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        });

        // === Scroll Animations ===
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        const hiddenElements = document.querySelectorAll('.scroll-reveal');
        hiddenElements.forEach(el => observer.observe(el));

        // === Header Scroll Effect ===
        const header = document.getElementById('main-header');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.classList.add('glass-effect');
            } else {
                header.classList.remove('glass-effect');
            }
        });


        // === Bet Preview Modal Logic ===
        const betCards = document.querySelectorAll('.bet-card');
        const modal = document.getElementById('bet-modal');
        const modalOverlay = document.getElementById('modal-overlay');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDesc = document.getElementById('modal-desc');
        const modalOdds = document.getElementById('modal-odds');
        const modalStatus = document.getElementById('modal-status');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        function showModal(card) {
            // Get data from the clicked card
            const image = card.querySelector('.bet-image').src;
            const title = card.querySelector('.bet-title').innerText;
            const desc = card.querySelector('.bet-desc').innerText;
            const odds = card.querySelector('.bet-odds');
            const status = card.querySelector('.bet-status');

            // Populate modal
            modalImage.src = image;
            modalTitle.innerText = title;
            modalDesc.innerText = desc;
            modalOdds.innerText = odds.innerText;
            modalOdds.className = odds.className; // Copy styling (color)
            modalStatus.innerText = status.innerText;
            modalStatus.className = status.className; // Copy styling (colors)
            
            // Show the modal
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('visible'), 10); // Delay to allow transition
        }

        function hideModal() {
            modal.classList.remove('visible');
            setTimeout(() => {
                 modal.classList.add('hidden');
            }, 300); // Wait for transition to finish
        }

        betCards.forEach(card => {
            card.addEventListener('click', () => {
                showModal(card);
            });
        });

        modalCloseBtn.addEventListener('click', hideModal);
        modalOverlay.addEventListener('click', hideModal);
