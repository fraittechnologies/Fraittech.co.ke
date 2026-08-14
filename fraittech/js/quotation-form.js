(function () {
    'use strict';

    var form = document.getElementById('quotationForm');
    if (!form) return;

    var nameEl = document.getElementById('clientName');
    var emailEl = document.getElementById('clientEmail');
    var phoneEl = document.getElementById('clientPhone');
    var coEl = document.getElementById('clientCompany');
    var serviceEl = document.getElementById('serviceType');
    var timelineEl = document.getElementById('timeline');
    var descEl = document.getElementById('projectDescription');
    var fileEl = document.getElementById('projectFile');
    var fileDrop = document.getElementById('projectFileDrop');
    var filePicked = document.getElementById('projectFilePicked');
    var fileNameEl = document.getElementById('projectFileName');
    var fileSizeEl = document.getElementById('projectFileSize');
    var fileRemove = document.getElementById('projectFileRemove');
    var fileWrap = form.querySelector('[data-field="file"]');
    var challengeEl = document.getElementById('challenge_answer');
    var challengeA = document.getElementById('challenge_a');
    var challengeB = document.getElementById('challenge_b');
    var challengeQ = document.getElementById('challengeQuestion');
    var challengeRefresh = document.getElementById('challengeRefresh');

    var DESC_MAX = 2000;
    var DESC_MIN = 20;
    var FILE_MAX = 8 * 1024 * 1024;
    var FILE_TYPES = {
        pdf: 1,
        doc: 1,
        docx: 1,
        png: 1,
        jpg: 1,
        jpeg: 1,
        webp: 1,
        gif: 1,
        zip: 1,
        txt: 1
    };

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function clearFileInput() {
        if (fileEl) fileEl.value = '';
        if (filePicked) filePicked.hidden = true;
        if (fileDrop) fileDrop.hidden = false;
        if (fileWrap) fileWrap.classList.remove('is-error', 'is-drag');
        setFieldState('file', '', '');
    }

    function showPicked(file) {
        if (fileNameEl) fileNameEl.textContent = file.name;
        if (fileSizeEl) fileSizeEl.textContent = formatFileSize(file.size);
        if (filePicked) filePicked.hidden = false;
        if (fileDrop) fileDrop.hidden = true;
    }

    function validateFile(file, live) {
        if (!file) return live ? '' : '';
        var ext = String(file.name || '').split('.').pop().toLowerCase();
        if (!FILE_TYPES[ext]) return 'Use PDF, Word, image, ZIP, or a text file.';
        if (file.size > FILE_MAX) return 'Keep the file under 8 MB (currently ' + formatFileSize(file.size) + ').';
        if (file.size < 1) return 'That file looks empty. Choose another.';
        return '';
    }

    function setFieldState(key, message, state) {
        var wrap = form.querySelector('[data-field="' + key + '"]');
        var hint = document.getElementById(key + '-hint');
        if (wrap) {
            wrap.classList.remove('is-ok', 'is-error');
            if (state === 'ok') wrap.classList.add('is-ok');
            if (state === 'error') wrap.classList.add('is-error');
        }
        if (hint) {
            hint.classList.remove('is-ok', 'is-error');
            if (state === 'error' && message) {
                hint.textContent = message;
                hint.classList.add('is-error');
            } else if (state === 'ok' && message) {
                hint.textContent = message;
                hint.classList.add('is-ok');
            } else {
                hint.textContent = message || '';
            }
        }
    }

    function validateName(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Enter your full name.';
        if (v.length < 2) return 'Name must be at least 2 characters.';
        if (!/^[a-zA-Z][a-zA-Z\s.'’-]*$/.test(v)) return 'Use letters only (spaces and hyphens are fine).';
        return '';
    }

    function validateEmail(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Enter your email address.';
        if (live && v.indexOf('@') === -1) return '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. you@company.com.';
        return '';
    }

    function normalizePhone254(value) {
        var digits = String(value || '').replace(/\D/g, '');
        if (digits.indexOf('254') === 0) return digits.slice(0, 12);
        if (digits.charAt(0) === '0') return '254' + digits.slice(1, 10);
        if (digits.charAt(0) === '7' || digits.charAt(0) === '1') return '254' + digits.slice(0, 9);
        return digits;
    }

    function expectedPhoneLength(digits) {
        if (digits.indexOf('254') === 0) return 12;
        if (digits.charAt(0) === '0') return 10;
        if (digits.charAt(0) === '7' || digits.charAt(0) === '1') return 9;
        return 10;
    }

    function validatePhone(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Enter your phone number.';
        var digits = v.replace(/\D/g, '');
        if (!digits.length) return live ? '' : 'Enter your phone number.';

        var need = expectedPhoneLength(digits);
        if (digits.length < need) {
            return live ? '' : 'Enter ' + need + ' digits. Currently ' + digits.length + '.';
        }
        if (digits.length > need) {
            return 'Use ' + need + ' digits for this format (currently ' + digits.length + ').';
        }

        var n = normalizePhone254(v);
        if (/^254(7|1)\d{8}$/.test(n)) return '';
        if (digits.charAt(0) === '0' && digits.charAt(1) !== '7' && digits.charAt(1) !== '1') {
            return 'Kenyan mobiles start with 07 or 01.';
        }
        return 'Enter a valid Kenyan mobile, 10 digits. e.g. 0712 345 678';
    }

    function validateCompany(value) {
        var v = String(value || '').trim();
        if (!v) return '';
        if (v.length < 2) return 'Company name must be at least 2 characters.';
        return '';
    }

    function validateService(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Choose the service you need.';
        return '';
    }

    function validateDescription(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Tell us what you need.';
        if (v.length < DESC_MIN) return 'Add a little more detail (at least ' + DESC_MIN + ' characters).';
        if (v.length > DESC_MAX) return 'Keep this under ' + DESC_MAX + ' characters.';
        return '';
    }

    function validateChallenge(value, live) {
        var v = String(value || '').trim();
        if (!v) return live ? '' : 'Solve the quick check before sending.';
        var a = parseInt(challengeA && challengeA.value, 10);
        var b = parseInt(challengeB && challengeB.value, 10);
        var ans = parseInt(v, 10);
        if (isNaN(a) || isNaN(b) || isNaN(ans)) return 'Enter the number answer.';
        if (ans !== a + b) return 'That answer is not correct. Try again.';
        return '';
    }

    function applyCheck(key, err, okMsg) {
        if (err) {
            setFieldState(key, err, 'error');
            return false;
        }
        if (okMsg) setFieldState(key, okMsg, 'ok');
        else setFieldState(key, '', '');
        return true;
    }

    function checkName(live) {
        var err = validateName(nameEl && nameEl.value, live);
        var v = nameEl && nameEl.value.trim();
        if (err) return applyCheck('name', err, '');
        if (v) return applyCheck('name', '', 'Looks good.');
        setFieldState('name', '', '');
        return true;
    }

    function checkEmail(live) {
        var err = validateEmail(emailEl && emailEl.value, live);
        var v = emailEl && emailEl.value.trim();
        if (err) return applyCheck('email', err, '');
        if (v && !validateEmail(v, false)) return applyCheck('email', '', 'We will reply here.');
        setFieldState('email', 'We will send your quotation to this address.', '');
        return true;
    }

    function checkPhone(live) {
        var raw = phoneEl && phoneEl.value || '';
        var digits = String(raw).replace(/\D/g, '');
        var err = validatePhone(raw, live);
        if (err) return applyCheck('phone', err, '');
        if (digits.length && !validatePhone(raw, false)) {
            return applyCheck('phone', '', 'Looks good.');
        }
        if (live && digits.length > 0) {
            var need = expectedPhoneLength(digits) - digits.length;
            if (need > 0) {
                setFieldState('phone', need + ' more digit' + (need === 1 ? '' : 's') + ' (10 digits for 07…, 12 for 254…).', '');
                return true;
            }
        }
        setFieldState('phone', 'Kenyan mobile, 10 digits. e.g. 0712 345 678', '');
        return true;
    }

    function checkCompany(live) {
        var err = validateCompany(coEl && coEl.value);
        var v = coEl && coEl.value.trim();
        if (live && !v) {
            setFieldState('company', '', '');
            return true;
        }
        return applyCheck('company', err, v && !err ? 'Looks good.' : '');
    }

    function checkService(live) {
        var err = validateService(serviceEl && serviceEl.value, live);
        var v = serviceEl && serviceEl.value.trim();
        return applyCheck('service', err, v && !err ? 'Looks good.' : '');
    }

    function checkTimeline() {
        var v = timelineEl && timelineEl.value.trim();
        if (v) setFieldState('timeline', 'Looks good.', 'ok');
        else setFieldState('timeline', '', '');
        return true;
    }

    function checkDescription(live) {
        var err = validateDescription(descEl && descEl.value, live);
        var raw = String(descEl && descEl.value || '');
        var left = DESC_MAX - raw.length;
        var v = raw.trim();
        if (err) return applyCheck('description', err, '');
        if (v) return applyCheck('description', '', left + ' characters left.');
        setFieldState('description', 'Goals, scope, links, deadlines — anything that helps.', '');
        return true;
    }

    function checkFile() {
        var file = fileEl && fileEl.files && fileEl.files[0];
        var err = validateFile(file, true);
        if (err) {
            if (fileWrap) fileWrap.classList.add('is-error');
            setFieldState('file', err, 'error');
            if (filePicked) filePicked.hidden = true;
            if (fileDrop) fileDrop.hidden = false;
            return false;
        }
        if (fileWrap) fileWrap.classList.remove('is-error');
        if (file) {
            showPicked(file);
            setFieldState('file', 'Attached. We will receive this with your request.', 'ok');
        } else {
            clearFileInput();
        }
        return true;
    }

    function checkChallenge(live) {
        var err = validateChallenge(challengeEl && challengeEl.value, live);
        var v = challengeEl && String(challengeEl.value || '').trim();
        if (err) return applyCheck('challenge', err, '');
        if (v) return applyCheck('challenge', '', 'Looks good.');
        setFieldState('challenge', 'Type the sum of the two numbers.', '');
        return true;
    }

    function newChallenge() {
        var a = 2 + Math.floor(Math.random() * 9);
        var b = 1 + Math.floor(Math.random() * 8);
        if (challengeA) challengeA.value = String(a);
        if (challengeB) challengeB.value = String(b);
        if (challengeQ) challengeQ.textContent = a + ' + ' + b;
        if (challengeEl) challengeEl.value = '';
        setFieldState('challenge', 'Type the sum of the two numbers.', '');
    }

    function validateForm(force) {
        var live = !force;
        var ok = true;
        ok = checkName(live) && ok;
        ok = checkEmail(live) && ok;
        ok = checkPhone(live) && ok;
        ok = checkCompany(live) && ok;
        ok = checkService(live) && ok;
        checkTimeline();
        ok = checkDescription(live) && ok;
        ok = checkFile() && ok;
        ok = checkChallenge(live) && ok;
        return ok;
    }

    function bindLive(el, fn) {
        if (!el) return;
        el.addEventListener('input', function () { fn(true); });
        el.addEventListener('change', function () { fn(true); });
        el.addEventListener('blur', function () { fn(false); });
    }

    bindLive(nameEl, checkName);
    bindLive(emailEl, checkEmail);
    bindLive(phoneEl, checkPhone);
    bindLive(coEl, checkCompany);
    bindLive(serviceEl, checkService);
    bindLive(timelineEl, checkTimeline);
    bindLive(descEl, checkDescription);
    bindLive(challengeEl, checkChallenge);

    if (fileEl) {
        fileEl.addEventListener('change', function () { checkFile(); });
    }
    if (fileRemove) {
        fileRemove.addEventListener('click', function () {
            clearFileInput();
        });
    }
    if (fileWrap) {
        ['dragenter', 'dragover'].forEach(function (evt) {
            fileWrap.addEventListener(evt, function (e) {
                e.preventDefault();
                fileWrap.classList.add('is-drag');
            });
        });
        ['dragleave', 'drop'].forEach(function (evt) {
            fileWrap.addEventListener(evt, function (e) {
                e.preventDefault();
                fileWrap.classList.remove('is-drag');
            });
        });
        fileWrap.addEventListener('drop', function (e) {
            var files = e.dataTransfer && e.dataTransfer.files;
            if (!files || !files.length || !fileEl) return;
            try {
                var dt = new DataTransfer();
                dt.items.add(files[0]);
                fileEl.files = dt.files;
            } catch (err) {
                return;
            }
            checkFile();
        });
    }

    if (challengeRefresh) {
        challengeRefresh.addEventListener('click', function () {
            newChallenge();
            if (challengeEl) challengeEl.focus();
        });
    }

    form.addEventListener('submit', function (e) {
        if (!validateForm(false)) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var firstBad = form.querySelector('.ft-q-field.is-error');
            if (firstBad && typeof firstBad.scrollIntoView === 'function') {
                firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            var focusable = firstBad && firstBad.querySelector('input, textarea, select');
            if (focusable) focusable.focus({ preventScroll: true });
        }
    }, true);

    form.addEventListener('reset', function () {
        window.setTimeout(function () {
            ['name', 'email', 'phone', 'company', 'service', 'timeline', 'description', 'file', 'challenge'].forEach(function (key) {
                setFieldState(key, '', '');
            });
            clearFileInput();
            checkPhone(true);
            checkDescription(true);
            newChallenge();
        }, 0);
    });

    checkPhone(true);
    checkDescription(true);
    newChallenge();
})();
