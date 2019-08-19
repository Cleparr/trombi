function shuffle(a) {
    var m = a.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = a[m];
    a[m] = a[i];
    a[i] = t;
    }
    return a;
}

exports.shuffle = shuffle;
