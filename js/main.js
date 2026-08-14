/* =========================================================
   Setta Energia — "Pode dizer sim"
   Scripts da landing page (vanilla JS, sem dependências)
   ========================================================= */
(function () {
  "use strict";

  var WHATSAPP_URL = "https://wa.me/558130195995";
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* Animações são um aprimoramento: qualquer erro restaura o conteúdo. */
  var motionSupported = !prefersReducedMotion && ("IntersectionObserver" in window);
  var disableMotion = function () {
    document.documentElement.classList.remove("motion-ready");
    document.documentElement.classList.add("motion-fallback");
    $$(".reveal").forEach(function (el) { el.classList.add("is-in"); });
    var firstDepo = $(".depo");
    if (firstDepo) firstDepo.classList.add("is-active");
    var indiqueSticky = $(".indique-scroll-sticky");
    if (indiqueSticky) {
      indiqueSticky.classList.remove("is-story-waiting");
      indiqueSticky.style.setProperty("--indique-copy-x", "0%");
      indiqueSticky.style.setProperty("--indique-eyebrow-opacity", "1");
      indiqueSticky.style.setProperty("--indique-type-progress", "1");
      indiqueSticky.style.setProperty("--indique-type-clip", "0%");
      indiqueSticky.style.setProperty("--indique-type-opacity", "1");
      indiqueSticky.style.setProperty("--indique-lead-opacity", "1");
      indiqueSticky.style.setProperty("--indique-button-opacity", "1");
      indiqueSticky.style.setProperty("--indique-image-opacity", "1");
    }
  };
  if (motionSupported) {
    document.documentElement.classList.add("motion-ready");
    window.addEventListener("error", disableMotion);
    window.addEventListener("unhandledrejection", disableMotion);
  }

  // Conteudo essencial: a FAQ e montada antes dos efeitos visuais para nunca
  // depender do sucesso de um carrossel ou de uma animacao posterior.
  initFaq();

  /* =======================================================
     1. Cabeçalho — sombra ao rolar
     ======================================================= */
  (function header() {
    var header = $("#header");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* =======================================================
     Hero e faixa de confiança — saída progressiva no scroll
     ======================================================= */
  (function heroScrollExit() {
    var hero = $(".hero");
    var trust = $(".trust");
    if (!hero || !trust || prefersReducedMotion) return;

    var ticking = false;
    var clamp = function (value) { return Math.max(0, Math.min(1, value)); };

    function update() {
      ticking = false;
      var heroRect = hero.getBoundingClientRect();
      var heroHeight = Math.max(hero.offsetHeight, 1);
      var heroProgress = clamp((-heroRect.top) / Math.max(420, heroHeight * .96));
      var heroEased = heroProgress * heroProgress * (3 - 2 * heroProgress);
      var trustStart = heroHeight * .58;
      var trustProgress = clamp(((-heroRect.top) - trustStart) / Math.max(180, heroHeight * .34));

      hero.style.setProperty("--hero-scroll-opacity", (1 - heroEased).toFixed(3));
      hero.style.setProperty("--hero-media-y", (-34 * heroEased).toFixed(2) + "px");
      hero.style.setProperty("--hero-media-scale", (1 + .025 * heroEased).toFixed(4));
      hero.style.setProperty("--hero-content-y", (-52 * heroEased).toFixed(2) + "px");
      trust.style.setProperty("--trust-scroll-opacity", (1 - trustProgress).toFixed(3));
      trust.style.setProperty("--trust-scroll-y", (28 * trustProgress).toFixed(2) + "px");
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  })();

  /* =======================================================
     2. Rolagem suave com compensação do cabeçalho
     ======================================================= */
  (function smoothScroll() {
    var headerEl = $("#header");

    var scrollToTarget = function (target) {
      if (!target) return;
      var offset = (headerEl ? headerEl.offsetHeight : 0) + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    $$("a[data-scroll]").forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id.charAt(0) !== "#") return;
        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();

        // Intenção "empresa" — marca no formulário sem criar campo obrigatório
        if (link.dataset.intent === "empresa") setIntent("empresa");

        scrollToTarget(target);

        // Move o foco para o destino (acessibilidade)
        window.setTimeout(function () {
          var focusable = target.matches("input, button, a, [tabindex]")
            ? target
            : target.querySelector("input, button, a, [tabindex]");
          if (focusable) focusable.focus({ preventScroll: true });
        }, prefersReducedMotion ? 0 : 480);
      });
    });
  })();

  /* Ramos de atuação — expansão compacta no mobile */
  (function companyBranches() {
    var list = $(".empresas__tags");
    var toggle = $(".empresas__tags-toggle");
    if (!list || !toggle) return;

    toggle.addEventListener("click", function () {
      var expanded = list.classList.toggle("is-expanded");
      toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
      toggle.setAttribute("aria-label", expanded ? "Ocultar ramos adicionais" : "Mostrar mais ramos de atuação");
    });
  })();

  function setIntent(value) {
    var field = $("#intencao");
    var note = $("#intent-note");
    var cnpjField = $("#campo-cnpj");
    if (field) field.value = value;
    if (note) note.hidden = value !== "empresa";
    if (cnpjField) cnpjField.hidden = value !== "empresa";
  }

  /* =======================================================
     Dica de arraste dos cards no mobile
     ======================================================= */
  (function tilesDragHint() {
    var tiles = $(".tiles");
    var hint = $("#tiles-hint");
    if (!tiles || !hint) return;

    var dragging = false;
    var dragged = false;
    var startX = 0;
    var startScrollLeft = 0;

    var dismissed = false;
    function dismissHint() {
      if (dismissed) return;
      dismissed = true;
      hint.classList.add("is-hidden");
    }

    tiles.addEventListener("scroll", function () {
      if (tiles.scrollLeft > 8) dismissHint();
    }, { passive: true });
    tiles.addEventListener("touchstart", dismissHint, { passive: true });
    tiles.addEventListener("pointerdown", function (event) {
      if (!window.matchMedia("(max-width: 899px)").matches) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      dragged = false;
      startX = event.clientX;
      startScrollLeft = tiles.scrollLeft;
      tiles.classList.add("is-dragging");
      tiles.setPointerCapture(event.pointerId);
      dismissHint();
    });

    tiles.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      var distance = event.clientX - startX;
      if (Math.abs(distance) > 4) dragged = true;
      tiles.scrollLeft = startScrollLeft - distance;
      if (dragged) event.preventDefault();
    }, { passive: false });

    function finishDrag(event) {
      if (!dragging) return;
      dragging = false;
      tiles.classList.remove("is-dragging");
      if (tiles.hasPointerCapture && tiles.hasPointerCapture(event.pointerId)) {
        tiles.releasePointerCapture(event.pointerId);
      }
    }

    tiles.addEventListener("pointerup", finishDrag);
    tiles.addEventListener("pointercancel", finishDrag);
    tiles.addEventListener("lostpointercapture", function () {
      dragging = false;
      tiles.classList.remove("is-dragging");
    });

    tiles.addEventListener("click", function (event) {
      if (dragged) event.preventDefault();
      dragged = false;
    }, true);

    tiles.addEventListener("keydown", function (event) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      dismissHint();
      var card = tiles.querySelector(".tile");
      var step = card ? card.getBoundingClientRect().width + 16 : tiles.clientWidth * .75;
      tiles.scrollBy({ left: event.key === "ArrowRight" ? step : -step, behavior: "smooth" });
    });
  })();

  /* =======================================================
     Mosaico desktop — segunda fileira revelada pela rolagem
     ======================================================= */
  (function tilesScrollReveal() {
    var tiles = $(".tiles");
    if (!tiles || tiles.children.length < 6) return;

    var desktop = window.matchMedia("(min-width: 900px)");
    var ticking = false;

    function clearEffect() {
      tiles.classList.remove("tiles--scroll-reveal");
      tiles.style.removeProperty("--tiles-back-offset");
      tiles.style.removeProperty("--tiles-back-opacity");
    }

    function update() {
      ticking = false;
      if (!desktop.matches || prefersReducedMotion) {
        clearEffect();
        return;
      }

      tiles.classList.add("tiles--scroll-reveal");
      var firstCard = tiles.querySelector(".tile");
      if (!firstCard) return;

      var rect = tiles.getBoundingClientRect();
      var cardHeight = firstCard.getBoundingClientRect().height;
      var gap = parseFloat(window.getComputedStyle(tiles).rowGap) || 18;
      var startLine = window.innerHeight * .52;
      var travel = Math.max(260, Math.min(cardHeight * .82, 430));
      var progress = Math.max(0, Math.min(1, (startLine - rect.top) / travel));
      var eased = 1 - Math.pow(1 - progress, 3);
      var offset = -(cardHeight + gap) * (1 - eased);

      tiles.style.setProperty("--tiles-back-offset", offset.toFixed(2) + "px");
      tiles.style.setProperty("--tiles-back-opacity", Math.min(1, progress * 1.7).toFixed(3));
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
    if (desktop.addEventListener) desktop.addEventListener("change", requestUpdate);
    else desktop.addListener(requestUpdate);
  })();

  /* =======================================================
     Como funciona — passos liberados em três tempos de scroll
     ======================================================= */
  (function routeScrollSteps() {
    var stage = $(".rota-scroll-stage");
    var route = stage ? $(".rota", stage) : null;
    if (!stage || !route) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      route.setAttribute("data-visible-step", "3");
      return;
    }

    route.setAttribute("data-visible-step", "1");
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      window.setTimeout(function () { route.setAttribute("data-visible-step", "2"); }, 260);
      window.setTimeout(function () { route.setAttribute("data-visible-step", "3"); }, 720);
    }, { threshold: .28, rootMargin: "0px 0px -8% 0px" });
    observer.observe(stage);
  })();

  /* =======================================================
     Indique e Ganhe — narrativa progressiva ligada ao scroll
     ======================================================= */
  (function referralScrollStory() {
    var stage = $(".indique-scroll-stage");
    var sticky = stage ? $(".indique-scroll-sticky", stage) : null;
    if (!stage || !sticky) return;

    function setValue(name, value) { sticky.style.setProperty(name, value); }
    function clamp(value) { return Math.max(0, Math.min(1, value)); }
    function segment(progress, start, end) {
      return clamp((progress - start) / Math.max(.001, end - start));
    }
    function showEverything() {
      sticky.classList.remove("is-story-waiting");
      setValue("--indique-copy-x", "0%");
      setValue("--indique-eyebrow-opacity", "1");
      setValue("--indique-type-progress", "1");
      setValue("--indique-type-clip", "0%");
      setValue("--indique-type-opacity", "1");
      setValue("--indique-lead-opacity", "1");
      setValue("--indique-button-opacity", "1");
      setValue("--indique-image-opacity", "1");
    }

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      showEverything();
      return;
    }

    sticky.classList.add("is-story-waiting");
    var ticking = false;

    function update() {
      ticking = false;
      var rect = stage.getBoundingClientRect();
      var travel = Math.max(1, stage.offsetHeight - sticky.offsetHeight);
      var progress = clamp(-rect.top / travel);

      // 1. "Indicou?" sozinho; 2. titulo digitado; 3. subtitulo e botao;
      // 4. texto vai para a esquerda; 5. fotografia entra suavemente.
      var title = segment(progress, .10, .34);
      var lead = segment(progress, .32, .50);
      var button = segment(progress, .46, .62);
      var shift = segment(progress, .58, .76);
      var photo = segment(progress, .70, .94);
      var desktop = window.matchMedia("(min-width: 900px)").matches;

      sticky.classList.toggle("is-story-waiting", shift < .52);
      setValue("--indique-copy-x", ((desktop ? 50 : 0) * (1 - shift)).toFixed(2) + "%");
      setValue("--indique-eyebrow-opacity", segment(progress, .24, .38).toFixed(3));
      setValue("--indique-type-progress", title.toFixed(3));
      setValue("--indique-type-clip", ((1 - title) * 100).toFixed(2) + "%");
      setValue("--indique-type-opacity", title.toFixed(3));
      setValue("--indique-lead-opacity", lead.toFixed(3));
      setValue("--indique-button-opacity", button.toFixed(3));
      setValue("--indique-image-opacity", photo.toFixed(3));
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  })();

  /* =======================================================
     4. Formulário — máscaras, validação e envio
     ======================================================= */
  (function leadForm() {
    var form = $("#lead-form");
    if (!form) return;

    var nome = $("#nome");
    var whatsapp = $("#whatsapp");
    var conta = $("#conta");
    var cnpj = $("#cnpj");
    var submit = $("#lead-submit");
    var status = $("#form-status");
    if (!nome || !whatsapp || !conta || !submit || !status) return;

    var onlyDigits = function (v) { return v.replace(/\D/g, ""); };

    var formatPhone = function (value) {
      var d = onlyDigits(value).slice(0, 11);
      if (d.length <= 2) return d.replace(/^(\d{0,2})/, "($1");
      if (d.length <= 6) return d.replace(/^(\d{2})(\d+)/, "($1) $2");
      if (d.length <= 10) return d.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
      return d.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    };

    var formatCurrency = function (value) {
      var cents = onlyDigits(value).slice(0, 9);
      if (!cents) return "";
      return (Number(cents) / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    };

    var formatCnpj = function (value) {
      return onlyDigits(value).slice(0, 14)
        .replace(/^(\d{2})(\d)/, "$1.$2")
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1/$2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    };

    whatsapp.addEventListener("input", function () { whatsapp.value = formatPhone(whatsapp.value); });
    conta.addEventListener("input", function () { conta.value = formatCurrency(conta.value); });
    if (cnpj) cnpj.addEventListener("input", function () { cnpj.value = formatCnpj(cnpj.value); });

    var rules = [
      {
        input: nome,
        error: $("#erro-nome"),
        test: function () { return nome.value.trim().length >= 2; },
        message: "Conta pra gente como podemos te chamar."
      },
      {
        input: whatsapp,
        error: $("#erro-whatsapp"),
        test: function () {
          var d = onlyDigits(whatsapp.value);
          return d.length === 10 || d.length === 11;
        },
        message: "Precisamos do WhatsApp com DDD, tipo (81) 99999-9999."
      },
      {
        input: conta,
        error: $("#erro-conta"),
        test: function () { return Number(onlyDigits(conta.value)) > 0; },
        message: "Informe o valor médio da sua conta de luz."
      }
    ];

    var setFieldState = function (rule, valid) {
      var field = rule.input.closest(".field");
      field.classList.toggle("has-error", !valid);
      rule.input.setAttribute("aria-invalid", valid ? "false" : "true");
      rule.error.textContent = valid ? "" : rule.message;
    };

    // Revalida em tempo real assim que o campo já foi marcado como inválido
    rules.forEach(function (rule) {
      rule.input.addEventListener("blur", function () {
        if (rule.input.value.trim() !== "") setFieldState(rule, rule.test());
      });
      rule.input.addEventListener("input", function () {
        if (rule.input.closest(".field").classList.contains("has-error")) {
          setFieldState(rule, rule.test());
        }
      });
    });

    /**
     * Ponto único de integração comercial.
     * Nenhum endpoint externo é chamado neste protótipo — conecte aqui o
     * CRM / webhook da Setta (fetch para a URL oficial) quando disponível.
     */
    function submitLead(payload) {
      // TODO: integração comercial pendente.
      // Exemplo: return fetch(ENDPOINT, { method: "POST", body: JSON.stringify(payload) });
      if (window.console && window.console.info) {
        window.console.info("[Setta] Lead pronto para envio:", payload);
      }
      return new Promise(function (resolve) {
        window.setTimeout(function () { resolve({ ok: true }); }, 800);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";

      var firstInvalid = null;
      rules.forEach(function (rule) {
        var valid = rule.test();
        setFieldState(rule, valid);
        if (!valid && !firstInvalid) firstInvalid = rule.input;
      });

      if (firstInvalid) {
        status.textContent = "Confere os campos destacados pra gente continuar.";
        firstInvalid.focus();
        return;
      }

      submit.setAttribute("aria-busy", "true");
      $(".btn__label", submit).textContent = "Enviando...";

      submitLead({
        nome: nome.value.trim(),
        whatsapp: onlyDigits(whatsapp.value),
        contaCentavos: Number(onlyDigits(conta.value)),
        intencao: $("#intencao").value,
        cnpj: cnpj ? onlyDigits(cnpj.value) : ""
      })
        .then(function () {
          form.reset();
          setIntent("residencial");
          openModal();
        })
        .catch(function () {
          status.textContent = "Não deu pra enviar agora. Tenta de novo em instantes ou fala com a gente no WhatsApp.";
        })
        .then(function () {
          submit.removeAttribute("aria-busy");
          $(".btn__label", submit).textContent = "Sim, quero saber mais";
        });
    });
  })();

  /* =======================================================
     5. Modal de sucesso
     ======================================================= */
  var lastFocused = null;

  function openModal() {
    var modal = $("#modal-sucesso");
    if (!modal) return;
    lastFocused = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(function () { modal.classList.add("is-open"); });
    var close = $(".modal__close", modal);
    if (close) close.focus();
  }

  function closeModal() {
    var modal = $("#modal-sucesso");
    if (!modal || modal.hidden) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    var finish = function () {
      modal.hidden = true;
      if (lastFocused) lastFocused.focus();
    };
    if (prefersReducedMotion) finish();
    else window.setTimeout(finish, 220);
  }

  (function modalEvents() {
    var modal = $("#modal-sucesso");
    if (!modal) return;

    $$("[data-close-modal]", modal).forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") { closeModal(); return; }
      if (e.key !== "Tab") return;

      // Focus trap simples
      var focusables = $$("button, a[href], input, [tabindex]:not([tabindex='-1'])", modal)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  })();

  /* =======================================================
     5b. Slots de fotografia ainda vazios
     Enquanto o arquivo não existir em assets/images/, o slot vira um
     placeholder com o caminho esperado — sem ícone de imagem quebrada.
     ======================================================= */
  (function photoSlots() {
    var marcarVazio = function (img) {
      var slot = img.closest(".shot");
      if (!slot) return;
      var src = img.getAttribute("src") || "";
      slot.classList.add("is-empty");
      slot.setAttribute("data-file", src.replace(/^assets\/images\//, ""));
      slot.setAttribute("role", "img");
      slot.setAttribute("aria-label", "Espaço reservado para foto: " + (img.getAttribute("alt") || src));
      img.hidden = true;
    };

    $$("img[data-ph]").forEach(function (img) {
      img.addEventListener("error", function () { marcarVazio(img); });
      if (img.complete && img.naturalWidth === 0) marcarVazio(img);
    });
  })();

  /* =======================================================
     6. Carrossel de depoimentos
     ======================================================= */
  (function carousel() {
    var root = $("#carousel");
    var track = $("#carousel-track");
    var dotsWrap = $("#carousel-dots");
    var prev = $("#carousel-prev");
    var next = $("#carousel-next");
    if (!root || !track || !dotsWrap) return;

    var slides = $$(".depo", track);
    if (!slides.length) return;

    var index = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel__dot";
      dot.setAttribute("aria-label", "Ir para o depoimento " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
    });
    var dots = $$(".carousel__dot", dotsWrap);

    function syncDots(i) {
      dots.forEach(function (dot, d) {
        if (d === i) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      // Reinicia a animação de entrada apenas no slide ativo
      slides.forEach(function (slide, sIdx) {
        slide.classList.toggle("is-active", sIdx === i);
      });
    }

    function goTo(i) {
      index = Math.max(0, Math.min(i, slides.length - 1));
      // Calcula a posicao dentro da propria faixa. offsetLeft pode usar outro
      // ancestral como referencia e, nesse caso, o segundo slide nao avanca.
      var trackRect = track.getBoundingClientRect();
      var slideRect = slides[index].getBoundingClientRect();
      var targetLeft = track.scrollLeft + slideRect.left - trackRect.left;
      track.scrollTo({ left: targetLeft, behavior: prefersReducedMotion ? "auto" : "smooth" });
      syncDots(index);
    }

    if (prev) prev.addEventListener("click", function () { goTo(index - 1 < 0 ? slides.length - 1 : index - 1); });
    if (next) next.addEventListener("click", function () { goTo(index + 1 >= slides.length ? 0 : index + 1); });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1 < 0 ? slides.length - 1 : index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1 >= slides.length ? 0 : index + 1); }
    });

    // Mantém os dots em sincronia com o gesto de arrastar / swipe
    var raf;
    track.addEventListener("scroll", function () {
      window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(function () {
        var trackRect = track.getBoundingClientRect();
        var center = trackRect.left + trackRect.width / 2;
        var closest = 0;
        var min = Infinity;
        slides.forEach(function (slide, i) {
          var rect = slide.getBoundingClientRect();
          var slideCenter = rect.left + rect.width / 2;
          var dist = Math.abs(slideCenter - center);
          if (dist < min) { min = dist; closest = i; }
        });
        index = closest;
        syncDots(index);
      });
    }, { passive: true });

    syncDots(0);
  })();

  /* Faixa contínua de marcas: a segunda sequência espelha a primeira. */
  (function clientLogoMarquee() {
    var firstGroup = $(".logo-marquee__group:not([aria-hidden])");
    var cloneGroup = $(".logo-marquee__group[aria-hidden='true']");
    if (!firstGroup || !cloneGroup) return;
    cloneGroup.innerHTML = firstGroup.innerHTML;
  })();

  /* =======================================================
     7. FAQ — accordion acessível (uma pergunta aberta por vez)
     ======================================================= */
  function initFaq() {
    var root = $("#faq");
    if (!root) return;
    if (root.children.length) return;

    var items = [
      {
        q: "Como funciona, na prática?",
        a: "A Setta gera energia solar em usinas próprias aqui na região e transforma isso em desconto pra você. Você assina, a gente ativa, e sua conta passa a chegar 20% mais barata. Acompanha tudo pelo app, portal ou WhatsApp."
      },
      {
        q: "O que eu preciso pra contratar?",
        a: "Pessoa física: uma foto da sua conta de luz e o documento do titular. Empresa: some o Contrato Social e o Cartão CNPJ. Assinatura digital, chega no seu e-mail."
      },
      {
        q: "Tem fidelidade?",
        a: "Não. Quer sair, é só avisar com 90 dias de antecedência. É o prazo que a distribuidora exige pros trâmites, não uma multa nossa."
      },
      {
        q: "Quando o desconto começa?",
        a: "Depende mais da distribuidora, mas pode levar até 30 dias depois da adesão. A gente cuida de tudo e te avisa quando ativar."
      },
      {
        q: "O desconto é fixo mesmo? E o valor?",
        a: "O percentual é fixo. O valor em reais acompanha seu consumo: conta maior num mês, economia maior naquele mês."
      },
      {
        q: "Como funciona sem instalar placa solar?",
        a: "A energia vem de usinas solares da Setta, já conectadas à rede. Você continua recebendo energia normalmente pela distribuidora, só passa a pagar menos por ela."
      },
      {
        q: "Vale a pena?",
        a: "Se pagar 20% a menos sem investir nada vale a pena pra você, então sim. Pra empresas com consumo alto, a economia é ainda maior."
      },
      {
        q: "Preciso mexer em alguma coisa na minha casa ou empresa?",
        a: "Em nada. Sem obra, sem instalação, sem manutenção, sem visita técnica."
      },
      {
        q: "Corro risco de ficar sem energia?",
        a: "Zero. Quem entrega a energia continua sendo a sua distribuidora. A Setta só muda o quanto você paga por ela."
      },
      {
        q: "Como o desconto aparece pra mim?",
        a: "Você recebe um boleto mensal da Setta já com os 20% aplicados. Sem letra miúda, com histórico no app e no portal."
      },
      {
        q: "Quem pode assinar?",
        a: "Casas, apartamentos e empresas em PE e RN, com consumo a partir de 200 kWh/mês para ligação monofásica ou 300 kWh/mês para ligação trifásica. Na dúvida, manda sua conta que a gente confere."
      },
      {
        q: "Funciona pra apartamento?",
        a: "Funciona, e é onde a Setta brilha, porque não precisa de telhado nem obra. Batendo o consumo mínimo, tá dentro."
      },
      {
        q: "Tem taxa escondida?",
        a: "Nenhuma. Sem adesão, sem instalação, sem manutenção, sem surpresa. Você paga a energia com 20% de desconto. Só."
      },
      {
        q: "E depois que eu contratar?",
        a: "A gente valida seus dados, resolve a burocracia com a distribuidora e te avisa a cada etapa pelo WhatsApp. Você não faz mais nada. Oxe, é sério."
      }
    ];

    var fragment = document.createDocumentFragment();

    items.forEach(function (item, i) {
      var wrap = document.createElement("div");
      wrap.className = "faq__item";

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "faq__trigger";
      btn.id = "faq-trigger-" + i;
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "faq-panel-" + i);
      btn.innerHTML = '<span>' + item.q + '</span><span class="faq__sign" aria-hidden="true"></span>';

      var panel = document.createElement("div");
      panel.className = "faq__panel";
      panel.id = "faq-panel-" + i;
      panel.setAttribute("role", "region");
      panel.setAttribute("aria-labelledby", btn.id);
      panel.style.height = "0px";

      var text = document.createElement("p");
      text.textContent = item.a;
      panel.appendChild(text);

      btn.addEventListener("click", function () {
        var isOpen = btn.getAttribute("aria-expanded") === "true";
        closeAll();
        if (!isOpen) open(btn, panel);
      });

      wrap.appendChild(btn);
      wrap.appendChild(panel);
      fragment.appendChild(wrap);
    });

    root.appendChild(fragment);

    function open(btn, panel) {
      btn.setAttribute("aria-expanded", "true");
      panel.style.height = panel.scrollHeight + "px";
      // Libera a altura após a transição para acompanhar reflow / zoom
      var done = function () {
        panel.style.height = "auto";
        panel.removeEventListener("transitionend", done);
      };
      if (prefersReducedMotion) done();
      else panel.addEventListener("transitionend", done);
    }

    function closeAll() {
      $$(".faq__trigger", root).forEach(function (btn) {
        if (btn.getAttribute("aria-expanded") !== "true") return;
        var panel = document.getElementById(btn.getAttribute("aria-controls"));
        btn.setAttribute("aria-expanded", "false");
        panel.style.height = panel.scrollHeight + "px";
        window.requestAnimationFrame(function () { panel.style.height = "0px"; });
      });
    }
  }

  /* =======================================================
     8. Reveal discreto ao entrar na viewport
     ======================================================= */
  (function reveal() {
    var targets = $$(".reveal");
    if (!targets.length) return;

    // Alterna a direção nos grandes blocos editoriais e marca as fotos.
    targets.forEach(function (el) {
      if (el.classList.contains("simples__media")) {
        el.classList.add("motion-from-left", "motion-photo");
      } else if (el.classList.contains("simples__copy")) {
        el.classList.add("motion-from-right");
      }
    });

    $$(".empresas, .indique, .depo__inner").forEach(function (block) {
      var copy = block.children[0];
      var media = block.children[1];
      if (copy) copy.classList.add("motion-from-left");
      if (media) media.classList.add("motion-from-right", "motion-photo");
    });

    $$(".rota__media, .tile__media").forEach(function (media) {
      media.classList.add("motion-photo");
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });

    targets.forEach(function (el) { observer.observe(el); });
  })();

  // Exposto apenas para referência de integração futura
  window.SETTA = { whatsapp: WHATSAPP_URL };
})();
