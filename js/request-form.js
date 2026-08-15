/**
 * BUCKY TOWING - SERVICE REQUEST FORM & GEOLOCATION
 * Real-time GPS detection, input validation, and dispatch simulator
 */

document.addEventListener('DOMContentLoaded', () => {
    initGeolocation();
    initServiceSelection();
    initFormSubmission();
    initPhotoUpload();
});

/* ---------------------------------------------------------
   1. Live GPS Geolocation Detection
   --------------------------------------------------------- */
function initGeolocation() {
    const geoBtn = document.getElementById('btn-get-location');
    const locationInput = document.getElementById('pickup_location');
    const locationStatus = document.getElementById('location-status');

    if (!geoBtn || !locationInput) return;

    geoBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser. Please enter your location manually.');
            return;
        }

        const originalText = geoBtn.innerHTML;
        geoBtn.innerHTML = `
            <span class="material-symbols-outlined animate-spin" style="animation: spin 1s linear infinite;">sync</span>
            Detecting GPS...
        `;
        geoBtn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = Math.round(position.coords.accuracy);

                // Attempt reverse geocoding via Nominatim
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                        headers: { 'Accept': 'application/json' }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        const address = data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                        locationInput.value = address;
                    } else {
                        locationInput.value = `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)}) - ±${accuracy}m`;
                    }
                } catch (err) {
                    locationInput.value = `Current Location (${lat.toFixed(4)}, ${lng.toFixed(4)}) - ±${accuracy}m`;
                }

                if (locationStatus) {
                    locationStatus.innerHTML = `
                        <span class="text-green-500 font-bold flex items-center gap-1 mt-1">
                            <span class="material-symbols-outlined text-sm">check_circle</span>
                            GPS Location Locked (Accuracy: ±${accuracy}m)
                        </span>
                    `;
                }

                geoBtn.innerHTML = originalText;
                geoBtn.disabled = false;
            },
            (error) => {
                console.warn('Geolocation error:', error);
                let msg = 'Unable to retrieve location. Please type your location.';
                if (error.code === error.PERMISSION_DENIED) {
                    msg = 'Location permission was denied. Please enter address manually.';
                }
                alert(msg);
                geoBtn.innerHTML = originalText;
                geoBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

/* ---------------------------------------------------------
   2. Service Reason Radio Selection
   --------------------------------------------------------- */
function initServiceSelection() {
    const radioInputs = document.querySelectorAll('input[name="service_reason"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', () => {
            radioInputs.forEach(r => {
                const parent = r.closest('.service-reason-option');
                if (parent) {
                    parent.classList.toggle('selected', r.checked);
                }
            });
        });
    });
}

/* ---------------------------------------------------------
   3. Photo Upload Preview
   --------------------------------------------------------- */
function initPhotoUpload() {
    const photoInput = document.getElementById('photo-upload');
    const photoBox = document.getElementById('photo-upload-box');
    const photoLabel = document.getElementById('photo-upload-label');

    if (!photoInput || !photoBox) return;

    photoBox.addEventListener('click', () => photoInput.click());

    photoInput.addEventListener('change', () => {
        if (photoInput.files && photoInput.files[0]) {
            const file = photoInput.files[0];
            if (photoLabel) {
                photoLabel.innerHTML = `
                    <span class="text-white font-bold flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-green-500">task_alt</span>
                        ${file.name} (${(file.size / 1024).toFixed(0)} KB)
                    </span>
                `;
            }
        }
    });
}

/* ---------------------------------------------------------
   4. Form Submission & Dispatch Simulator
   --------------------------------------------------------- */
function initFormSubmission() {
    const form = document.getElementById('service-request-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const pickup = document.getElementById('pickup_location')?.value.trim();
        const phone = document.getElementById('customer_phone')?.value.trim();
        const name = document.getElementById('customer_name')?.value.trim();
        const vehicle = document.getElementById('vehicle_yymm')?.value.trim();
        const service = document.querySelector('input[name="service_reason"]:checked')?.value || 'Tow';

        if (!pickup || !phone || !name || !vehicle) {
            alert('Please fill out all required fields marked with *');
            return;
        }

        // Show Dispatch Confirmation Modal
        showDispatchModal({ name, phone, pickup, vehicle, service });
    });
}

function showDispatchModal({ name, phone, pickup, vehicle, service }) {
    const existingModal = document.getElementById('dispatch-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.id = 'dispatch-modal';
    modal.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(12px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.3s ease-out;
    `;

    modal.innerHTML = `
        <div style="background: #141414; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; max-width: 520px; width: 100%; padding: 32px; box-shadow: 0 20px 60px rgba(0,0,0,0.9); text-align: center;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #E61919; color: white; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 0 25px rgba(230,25,25,0.6);">
                <span class="material-symbols-outlined" style="font-size: 40px;">check_circle</span>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 8px;">Request Dispatched!</h3>
            <p style="color: #A1A1A1; font-size: 1.05rem; margin-bottom: 24px;">
                Thank you, <strong style="color: white;">${name}</strong>. Our nearest Madison/Dane County unit has been alerted. We will call you immediately at <strong style="color: #E61919;">${phone}</strong>.
            </p>
            
            <div style="background: #1C1C1C; border-radius: 10px; padding: 16px; text-align: left; margin-bottom: 24px; font-size: 0.95rem; color: #E2E2E2;">
                <div style="margin-bottom: 6px;"><strong>Service:</strong> <span style="color: #E61919; text-transform: uppercase;">${service}</span></div>
                <div style="margin-bottom: 6px;"><strong>Vehicle:</strong> ${vehicle}</div>
                <div><strong>Location:</strong> ${pickup}</div>
            </div>

            <div style="display: flex; flex-direction: column; gap: 12px;">
                <a href="tel:6086906868" class="btn btn-primary btn-large w-full flex items-center justify-center gap-2">
                    <span class="material-symbols-outlined">call</span> Call Dispatcher (608-690-6868)
                </a>
                <button id="modal-close-btn" style="background: transparent; color: #A1A1A1; padding: 10px; font-size: 1rem; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1);">
                    Close & Return to Site
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('modal-close-btn').addEventListener('click', () => {
        modal.remove();
        window.location.href = 'index.html';
    });
}
