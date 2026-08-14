(function () {
  'use strict';

  var form = document.getElementById('contactForm');
  if (!form) return;

  var fields = {
    name: form.querySelector('#name'),
    email: form.querySelector('#email'),
    phone: form.querySelector('#phone'),
    subject: form.querySelector('#subject'),
    message: form.querySelector('#message'),
    challenge: form.querySelector('#challenge_answer')
  };

  var challengeA = form.querySelector('#challenge_a');
  var challengeB = form.querySelector('#challenge_b');
  var challengeQ = document.getElementById('challengeQuestion');
  var challengeRefresh = document.getElementById('challengeRefresh');
  var formStarted = form.querySelector('#form_started');
  var summary = document.getElementById('formSummary');
  var submitBtn = form.querySelector('#submitBtn');

  if (formStarted) formStarted.value = String(Date.now());

  function setHint(key, message, state) {
    var hint =
      key === 'challenge'
        ? document.getElementById('challenge-hint')
        : document.getElementById(key + '-hint');
    if (!hint) return;
    hint.classList.remove('is-error', 'is-ok');
    if (state === 'error' && message) {
      hint.textContent = message;
      hint.classList.add('is-error');
    } else if (state === 'ok' && message) {
      hint.textContent = message;
      hint.classList.add('is-ok');
    } else if (key === 'phone') {
      hint.textContent = 'Kenyan mobile, 10 digits. e.g. 0712 345 678';
      hint.classList.remove('is-error', 'is-ok');
    } else {
      hint.textContent = message || '';
    }
  }

  function markField(input, state) {
    if (!input) return;
    var wrap = input.closest('.ft-ct-field');
    if (wrap) {
      wrap.classList.remove('is-ok', 'is-error');
      if (state === 'error') wrap.classList.add('is-error');
      if (state === 'ok') wrap.classList.add('is-ok');
    }
  }

  function validateName(value, live) {
    var v = String(value || '').trim();
    if (!v) return live ? '' : 'Enter your name.';
    if (v.length < 2) return 'Name must be at least 2 characters.';
    if (!/^[a-zA-Z][a-zA-Z\s.'’-]*$/.test(v)) return 'Use letters only (spaces and hyphens are fine).';
    return '';
  }

  function validateEmail(value, live) {
    var v = String(value || '').trim();
    if (!v) return live ? '' : 'Enter your email address.';
    if (live && v.indexOf('@') === -1) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email, e.g. name@company.com.';
    return '';
  }

  function expectedPhoneLength(digits) {
    if (digits.indexOf('254') === 0) return 12;
    if (digits.charAt(0) === '0') return 10;
    if (digits.charAt(0) === '7' || digits.charAt(0) === '1') return 9;
    return 10;
  }

  function normalizePhone254(value) {
    var digits = String(value || '').replace(/\D/g, '');
    if (digits.indexOf('254') === 0) return digits.slice(0, 12);
    if (digits.charAt(0) === '0') return '254' + digits.slice(1, 10);
    if (digits.charAt(0) === '7' || digits.charAt(0) === '1') return '254' + digits.slice(0, 9);
    return digits;
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

  function validateSubject(value, live) {
    var v = String(value || '').trim();
    if (!v) return live ? '' : 'Add a short subject.';
    if (v.length < 3) return 'Subject must be at least 3 characters.';
    return '';
  }

  function validateMessage(value, live) {
    var v = String(value || '').trim();
    if (!v) return live ? '' : 'Write your message.';
    if (v.length < 10) return 'Message must be at least 10 characters.';
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

  var validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
    subject: validateSubject,
    message: validateMessage,
    challenge: validateChallenge
  };

  function runField(key, live) {
    var input = fields[key];
    if (!input) return true;
    var err = validators[key](input.value, !!live);
    if (err) {
      markField(input, 'error');
      setHint(key, err, 'error');
      return false;
    }
    if (key === 'phone') {
      var digits = String(input.value || '').replace(/\D/g, '');
      if (digits.length && !validators.phone(input.value, false)) {
        markField(input, 'ok');
        setHint(key, 'Looks good.', 'ok');
        return true;
      }
      if (live && digits.length > 0) {
        var need = expectedPhoneLength(digits) - digits.length;
        if (need > 0) {
          markField(input, '');
          setHint(key, need + ' more digit' + (need === 1 ? '' : 's') + ' (10 digits for 07…, 12 for 254…).', '');
          return true;
        }
      }
      markField(input, '');
      setHint(key, '', '');
      return true;
    }
    if (String(input.value || '').trim()) {
      markField(input, 'ok');
      if (key === 'challenge') setHint(key, 'Looks good.', 'ok');
      else if (key === 'email') setHint(key, 'We will reply here.', 'ok');
      else setHint(key, 'Looks good.', 'ok');
    } else {
      markField(input, '');
      setHint(key, key === 'challenge' ? 'Type the sum of the two numbers.' : '', '');
    }
    return true;
  }

  function collectErrors() {
    var errors = [];
    Object.keys(validators).forEach(function (key) {
      var input = fields[key];
      if (!input) return;
      var err = validators[key](input.value, false);
      if (err) {
        errors.push(err);
        markField(input, 'error');
        setHint(key, err, 'error');
      } else {
        markField(input, String(input.value || '').trim() ? 'ok' : '');
        if (key === 'challenge' || key === 'phone' || key === 'email') {
          setHint(key, key === 'email' ? 'We will reply here.' : 'Looks good.', 'ok');
        } else {
          setHint(key, 'Looks good.', 'ok');
        }
      }
    });
    return errors;
  }

  function updateSummary(errors) {
    if (!summary) return;
    if (!errors || !errors.length) {
      summary.hidden = true;
      summary.textContent = '';
      summary.classList.remove('is-error');
      return;
    }
    summary.hidden = false;
    summary.classList.add('is-error');
    summary.innerHTML =
      '<strong>Please fix the following:</strong><ul>' +
      errors
        .map(function (e) {
          return '<li>' + e.replace(/</g, '&lt;') + '</li>';
        })
        .join('') +
      '</ul>';
  }

  function newChallenge() {
    var a = 2 + Math.floor(Math.random() * 9);
    var b = 1 + Math.floor(Math.random() * 8);
    if (challengeA) challengeA.value = String(a);
    if (challengeB) challengeB.value = String(b);
    if (challengeQ) challengeQ.textContent = a + ' + ' + b;
    if (fields.challenge) {
      fields.challenge.value = '';
      markField(fields.challenge, '');
      setHint('challenge', 'Type the sum of the two numbers.', '');
    }
  }

  Object.keys(fields).forEach(function (key) {
    var input = fields[key];
    if (!input) return;
    input.addEventListener('input', function () {
      runField(key, true);
      if (summary && !summary.hidden) updateSummary(collectErrors());
    });
    input.addEventListener('blur', function () {
      runField(key, false);
    });
  });

  if (challengeRefresh) {
    challengeRefresh.addEventListener('click', function () {
      newChallenge();
      if (fields.challenge) fields.challenge.focus();
    });
  }

  newChallenge();

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var errors = collectErrors();
    updateSummary(errors);
    if (errors.length) {
      var firstInvalid = form.querySelector('.ft-ct-field.is-error .ft-ct-input');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var btn = submitBtn;
    var busy = form.getAttribute('data-ft-busy-label') || 'Sending…';
    var orig = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = busy;
    }

    var fd = new FormData(form);
    fetch(form.getAttribute('action') || 'contact-handler.php', {
      method: 'POST',
      body: fd,
      headers: { Accept: 'application/json' },
      credentials: 'same-origin'
    })
      .then(function (r) {
        return r.text().then(function (t) {
          return { ok: r.ok, text: t, status: r.status };
        });
      })
      .then(function (res) {
        var data;
        try {
          data = JSON.parse(res.text.replace(/^\uFEFF/, '').trim());
        } catch (err) {
          throw new Error(res.ok ? 'Unexpected response from server.' : 'Request failed (' + res.status + ').');
        }
        if (data.success) {
          if (window.FtNotify) window.FtNotify.success(data.message || 'Message sent.', 'Thank you');
          form.reset();
          if (formStarted) formStarted.value = String(Date.now());
          Object.keys(fields).forEach(function (key) {
            markField(fields[key], '');
            setHint(key, '', '');
          });
          updateSummary([]);
          newChallenge();
        } else {
          throw new Error(data.message || 'Something went wrong.');
        }
      })
      .catch(function (err) {
        if (window.FtNotify) window.FtNotify.error(err.message || 'Something went wrong.', 'Form');
        if (summary) {
          summary.hidden = false;
          summary.classList.add('is-error');
          summary.textContent = err.message || 'Something went wrong.';
        }
        newChallenge();
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = orig;
        }
      });
  });
})();
