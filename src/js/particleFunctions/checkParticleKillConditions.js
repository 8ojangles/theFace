var checkParticleKillConditions = function checkParticleKillConditions(p, canW, canH) {
    // check on particle kill conditions
    // seems complicated ( nested IFs ) but tries to stop check
    // without having to make all the checks if a condition is hit
    var k = p.killConditions;
    var kCol = k.colorCheck;
    var kAttr = k.perAttribute;
    var kBO = k.boundaryOffset;

    if (kCol.length > 0) {
        for (var i = kCol.length - 1; i >= 0; i--) {
            var thisCheckItem = kCol[i];
            if (p.color4Data[thisCheckItem.name] <= thisCheckItem.value) {
                return true;
            }
        }
    }

    if (kAttr.length > 0) {
        for (var i = kAttr.length - 1; i >= 0; i--) {
            var thisCheckItem = kAttr[i];
            if (p[thisCheckItem.name] <= thisCheckItem.value) {
                return true;
            }
        }
    }

    if (k.boundaryCheck === true) {
        // store p.r and give buffer ( * 4 ) to accomodate possible warping
        var pRad = p.r * 4;
        if (p.x - pRad < 0 - kBO) {
            return true;
        } else {
            if (p.x + pRad > canW + kBO) {
                return true;
            } else {
                if (p.y - pRad < 0 - kBO) {
                    return true;
                } else {
                    if (p.y + pRad > canH + kBO) {
                        return true;
                    }
                }
            }
        }
    }

    return false;
};

module.exports.checkParticleKillConditions = checkParticleKillConditions;