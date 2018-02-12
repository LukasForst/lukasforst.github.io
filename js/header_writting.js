var isTyping = false;

var TxtType = function (el, toRotate, period, breakpointString) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
    this.breakpointString = breakpointString;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span id="typeTextWrapper" class="wrap" style="border-right: 0.08em solid">' + this.txt + '</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) {
        delta /= 3;
    }

    if (!this.isDeleting && this.txt === fullTxt) {
        if (this.txt === this.breakpointString) {
            var css = document.getElementById("typeTextWrapper");
            css.setAttribute("style", "border-right: ");
            isTyping = false;
            return;
        }

        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        this.loopNum++;
        delta = 500;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

var StartTyping = function (breakpointString) {
    var elements = document.getElementsByClassName('typewrite');
    var toRotate = elements[0].getAttribute('data-type');
    var period = elements[0].getAttribute('data-period');
    if (toRotate && !isTyping) {
        isTyping = true;
        new TxtType(elements[0], JSON.parse(toRotate), period, breakpointString);
    }
};

window.onload = function () {
    new StartTyping("Welcome");
};