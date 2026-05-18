window.AVE = window.AVE || {};

AVE.visualizers = [];
AVE.currentIndex = 0;
AVE.currentVis = null;

const STORAGE_KEY = "AVE_SELECTED_VIS";

AVE.register = function (vis) {
  this.visualizers.push(vis);
};

AVE.loadSaved = function () {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved !== null) {
    const index = parseInt(saved);
    if (!isNaN(index) && index < this.visualizers.length) {
      this.currentIndex = index;
    }
  }
};

AVE.save = function () {
  localStorage.setItem(STORAGE_KEY, this.currentIndex);
};

AVE.next = function (target) {
  if (this.visualizers.length === 0) return;

  this.currentIndex = (this.currentIndex + 1) % this.visualizers.length;
  this.setVis(this.visualizers[this.currentIndex], target);

  this.save();
};

AVE.setVis = function (vis, target) {
  this.currentVis = vis;
  if (vis.init) vis.init(target);
};

AVE.render = function (ctx, data, time, canvas) {
  if (this.currentVis && this.currentVis.render) {
    this.currentVis.render(ctx, data, time, canvas);
  }
};