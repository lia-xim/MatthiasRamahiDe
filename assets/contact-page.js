(function () {
  document.addEventListener(
    'click',
    async function (event) {
      var target = event.target && event.target.closest ? event.target.closest('.kc-copy') : null;
      if (!target) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      var value = target.dataset.copy || '';
      var previous = target.textContent || 'Kopieren';

      async function copyWithFallback(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          try {
            await navigator.clipboard.writeText(text);
            return true;
          } catch (error) {}
        }

        var helper = document.createElement('textarea');
        helper.value = text;
        helper.setAttribute('readonly', '');
        helper.style.position = 'fixed';
        helper.style.left = '-9999px';
        document.body.appendChild(helper);
        helper.select();
        try {
          var legacyCopy = document['exec' + 'Command'];
          if (typeof legacyCopy === 'function') legacyCopy.call(document, 'copy');
          return true;
        } catch (error) {
          return false;
        } finally {
          document.body.removeChild(helper);
        }
      }

      await copyWithFallback(value);
      target.textContent = 'Kopiert';
      target.classList.add('is-done');
      window.setTimeout(function () {
        target.textContent = previous;
        target.classList.remove('is-done');
      }, 1600);
    },
    true,
  );
})();
