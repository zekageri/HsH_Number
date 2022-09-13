class hsNumber extends HTMLElement {
    offset = 1;
    input = null;
    min = null;
    max = null;
    animTimer = null;
    errorAnimTimer = null;
    events = {
        "decrease": null,
        "increase": null,
        "change": null
    };
    template = `
        <div class="hs-number-wrapper">
            <button class="hs-number-btn" action="minus"> - </button>
                <input class="hs-number-input" type="number" value="0"></input>
            <button class="hs-number-btn" action="plus"> + </button>
        </div>
    `;
    connectedCallback() {
        this.id = this.getAttribute("id");
        if (!this.id || this.id === "") {
            console.error("[HSH-Number] - Number should have an ID.");
            return;
        }

        this.addTemplate();
        this.getAttributes();
        this.addEvents();
    }

    on(type, cb) {
        if (!this.events.hasOwnProperty(type)) { console.error(`[HSH-Number] - No such event as ${type}!`); return; }
        this.events[type] = cb;
    }

    getAttributes() {
        let min = this.getAttribute("min");
        let max = this.getAttribute("max");
        if (min) { this.min = min; this.input.setAttribute("min", min); this.input.value = min; }
        if (max) { this.max = max; this.input.setAttribute("max", max); }
    }

    addTemplate() {
        this.innerHTML = "";
        this.insertAdjacentHTML("beforeend", this.template);
        this.input = this.querySelector(".hs-number-input");
    }

    addEvents() {
        let self = this;
        let buttons = this.querySelectorAll(".hs-number-btn");
        for (let button of buttons) {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                let action = button.getAttribute("action");
                if (action == "minus") {
                    self.decrease();
                } else if (action == "plus") {
                    self.increase();
                }
                if (self.events["change"] !== null) {
                    self.events.change(parseInt(self.input.value));
                }
            }, false);
        }

        this.input.addEventListener("input", function () {
            self.setLength();
        }, false);

        this.input.addEventListener("change", function () {
            if (self.min !== null && self.max !== null) {
                let val = parseInt(self.input.value);
                let valToAdjust = val;
                if (val > self.max) { valToAdjust = self.max; }
                if (val <= self.min) { valToAdjust = self.min; }
                if (valToAdjust !== val) {
                    self.input.value = valToAdjust;
                    self.addErrorAnimation();
                    self.setLength();
                }
            }
        }, false);
    }

    decrease() {
        let newValue = parseInt(this.input.value) - this.offset;
        if (!newValue) { newValue = 0; }
        if (this.min) {
            if (newValue < this.min) {
                this.input.value = this.min;
                this.addErrorAnimation();
                return;
            }
        }
        this.input.value = newValue;
        this.addAnimation();
        if (this.events["decrease"] !== null) {
            this.events.decrease(parseInt(this.input.value));
        }
    }

    increase() {
        let newValue = parseInt(this.input.value) + this.offset;
        if (!newValue) { newValue = 0; }
        if (this.max) {
            if (newValue > this.max) {
                this.input.value = this.max;
                this.addErrorAnimation();
                return;
            }
        }
        this.input.value = newValue;
        this.addAnimation();
        if (this.events["increase"] !== null) {
            this.events.increase(parseInt(this.input.value));
        }
    }

    addErrorAnimation() {
        let self = this;
        this.input.classList.add("error");
        clearTimeout(this.errorAnimTimer);
        this.errorAnimTimer = setTimeout(function () {
            self.input.classList.remove("error");
        }, 100);
    }

    addAnimation() {
        let self = this;
        this.input.classList.add("changed");
        clearTimeout(this.animTimer);
        this.animTimer = setTimeout(function () {
            self.input.classList.remove("changed");
        }, 100);
    }

    setLength() {
        this.input.style.width = this.input.value.length + "ch";
    }


    val() {
        return parseInt(this.input.value);
    }

    numIsValid(value) {
        let newVal = parseInt(value);
        if (isNaN(newVal)) {
            console.error("[HSH-Number] - Value is not a number!");
            return false;
        }
        return true;
    }

    setVal(newVal, shouldCallCallback = false) {
        this.input.value = newVal;
        this.addAnimation();

        if (shouldCallCallback && this.events["change"] !== null) {
            this.events.change(parseInt(this.input.value));
        }
    }

    val(value, shouldCallCallback = false) {
        if (!this.numIsValid(value)) { return; }
        let newVal = parseInt(value);
        if (this.min !== null && this.max !== null) {
            if (newVal >= this.min && newVal <= this.max) {
                this.setVal(value, shouldCallCallback);
            } else {
                console.error(`[HSH-Number] - Value is out of bounds. Min: ${this.min} Max: ${this.max}!`);
            }
        } else {
            this.setVal(value, shouldCallCallback);
        }
    }

    setMin(value) {
        if (!this.numIsValid(value)) { return; }
        this.setAttribute("min", value);
        this.getAttributes();
    }

    setMax(value) {
        if (!this.numIsValid(value)) { return; }
        this.setAttribute("max", value);
        this.getAttributes();
    }
    removeBounds() {
        this.min = null;
        this.max = null;
    }
};
customElements.define('hs-number', hsNumber);