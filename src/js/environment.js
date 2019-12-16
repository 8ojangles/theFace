var environment = {

		runtimeEngine: {

				startAnimation: function startAnimation(animVar, loopFn) {
						if (!animVar) {
								animVar = window.requestAnimationFrame(loopFn);
						}
				},

				stopAnimation: function stopAnimation(animVar) {
						if (animVar) {
								window.cancelAnimationFrame(animVar);
								animVar = undefined;
						}
				}

		},

		canvas: {
				// buffer clear fN
				checkClearBufferRegion: function checkClearBufferRegion(particle, canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						var entityWidth = particle.r / 2;
						var entityHeight = particle.r / 2;

						if (particle.x - entityWidth < bufferClearRegion.x) {
								bufferClearRegion.x = particle.x - entityWidth;
						}

						if (particle.x + entityWidth > bufferClearRegion.x + bufferClearRegion.w) {
								bufferClearRegion.w = particle.x + entityWidth - bufferClearRegion.x;
						}

						if (particle.y - entityHeight < bufferClearRegion.y) {
								bufferClearRegion.y = particle.y - entityHeight;
						}

						if (particle.y + entityHeight > bufferClearRegion.y + bufferClearRegion.h) {
								bufferClearRegion.h = particle.y + entityHeight - bufferClearRegion.y;
						}
				},

				resetBufferClearRegion: function resetBufferClearRegion(canvasConfig) {

						var bufferClearRegion = canvasConfig.bufferClearRegion;

						bufferClearRegion.x = canvasConfig.centerH;
						bufferClearRegion.y = canvasConfig.centerV;
						bufferClearRegion.w = canvasConfig.width;
						bufferClearRegion.h = canvasConfig.height;
				}
		},

		forces: {
				friction: 0.01,
				bouyancy: 1,
				gravity: 0,
				wind: 1,
				turbulence: { min: -5, max: 5 }
		}

};

module.exports.environment = environment;