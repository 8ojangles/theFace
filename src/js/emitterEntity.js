// utilities
var mathUtils = require('./mathUtils.js').mathUtils;

function EmitterEntity(emitterName, emitterTheme, particleOpts, emitFn) {

    this.name = emitterName;

    // emitter entity config
    this.emitterOpts = emitterTheme;
    // emitter emission config
    this.emissionOpts = this.emitterOpts.emission;
    // emitter particle config
    this.particleOpts = particleOpts;

    // saves drilling down
    var emitter = this.emitterOpts.emitter;
    var emission = this.emissionOpts;
    var emitRate = emission.rate;
    var emitRepeat = emission.repeater;

    // emitter master clock init
    this.localClock = 0;
    this.localClockRunning = false;
    this.emitFn = emitFn;
    // emitter life
    this.active = emitter.active;

    // emitter vectors
    this.x = emitter.x;
    this.y = emitter.y;
    this.xVel = emitter.xVel;
    this.yVel = emitter.yVel;

    // emitter environmental influences
    this.applyGlobalForces = emitter.applyGlobalForces;

    // emitter emission config
    // emission rate
    this.rateMin = emitRate.min;
    this.rateMax = emitRate.max;
    this.rateDecay = emitRate.decay.rate;
    this.rateDecayMax = emitRate.decay.decayMax;

    // emission repetition
    this.repeatRate = emitRepeat.rate;
    this.repeatDecay = emitRepeat.decay.rate;
    this.repeatDecayMax = emitRepeat.decay.decayMax;
    this.triggerType = 'mouseClickEvent';

    this.initValues = {
        rateMin: emitRate.min,
        rateMax: emitRate.max,
        rateDecay: emitRate.decay.rate,
        rateDecayMax: emitRate.decay.decayMax,
        repeatRate: emitRepeat.rate,
        repeatDecay: emitRepeat.decay.rate,
        repeatDecayMax: emitRepeat.decay.decayMax
    };
}

EmitterEntity.prototype.resetEmissionValues = function () {
    var self = this;

    self.rateMin = self.initValues.rateMin;
    self.rateMax = self.initValues.rateMax;
    self.rateDecay = self.initValues.rateDecay;
    self.rateDecayMax = self.initValues.rateDecayMax;
    self.repeatRate = self.initValues.repeatRate;
    self.repeatDecay = self.initValues.repeatDecay;
    self.repeatDecayMax = self.initValues.repeatDecayMax;
};

EmitterEntity.prototype.updateEmitter = function (updateOpts) {
    var self = this;

    var updates = updateOpts || false;
    var triggerEmitterFlag = false;

    if (updates !== false) {
        self.x = updates.x;
        self.y = updates.y;
    }

    self.x += self.xVel;
    self.y += self.yVel;

    if (self.active === 1) {

        if (self.repeatRate > 0 && self.localClockRunning === true) {

            if (self.localClock % self.repeatRate === 0) {
                triggerEmitterFlag = true;

                if (self.repeatDecay < self.repeatDecayMax) {
                    self.repeatRate += self.repeatDecay;
                    self.localClock = 0;
                    self.localClockRunning === true;
                }

                if (self.rateDecay > 0) {
                    self.rateMin > self.rateDecayMax ? self.rateMin -= self.rateDecay : self.rateMin = 0;
                    self.rateMax > self.rateDecayMax ? self.rateMax -= self.rateDecay : self.rateMax = 0;
                }
            } else {
                triggerEmitterFlag = false;
            }
        }

        self.localClock++;
    }

    if (triggerEmitterFlag === true) {
        self.triggerEmitter({ x: self.x, y: self.y });
    }
};

EmitterEntity.prototype.triggerEmitter = function (triggerOptions) {
    var self = this;

    var thisX, thisY;
    var triggerOpts = triggerOptions || false;
    if (triggerOpts !== false) {
        thisX = triggerOpts.x;
        thisY = triggerOpts.y;
    } else {
        thisX = self.x;
        thisY = self.y;
    }

    self.x = thisX;
    self.y = thisY;

    self.active = true;
    self.localClockRunning = true;

    var emitAmount = mathUtils.randomInteger(self.rateMin, self.rateMax);

    self.emitFn(thisX, thisY, emitAmount, self.emissionOpts, self.particleOpts);

    if (self.repeatRate > 0) {
        self.active = 1;

        // self.updateEmitter( { x: thisX, y: thisY } );
    }
};

EmitterEntity.prototype.renderEmitter = function (context) {
    context.strokeStyle = 'rgb( 255, 255, 255 )';
    context.strokeWidth = 5;
    context.line(this.x, this.y - 15, this.x, this.y + 15, context);
    context.line(this.x - 15, this.y, this.x + 15, this.y, context);
    context.strokeCircle(this.x, this.y, 10, context);
};

EmitterEntity.prototype.killEmitter = function () {};

module.exports.EmitterEntity = EmitterEntity;