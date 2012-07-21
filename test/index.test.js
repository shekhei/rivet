var rivet = require('../lib/index')
  , should = require('should')

describe('rivet', function() {
  
  describe('module', function() {
    it('should export default singleton', function() {
      rivet.should.be.an.instanceOf(rivet.Rivet);
    })
    it('should export version', function() {
      rivet.version.should.be.a.string;
    })
  })
  
  describe('with task', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] ? 'err' : 'ok');
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke task function', function() {
        r.scratch.foo.should.equal('ok');
      })
    })
  })
  
  describe('with task declared multiple times', function() {
    var r = new rivet.Rivet();
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] ? 'err' : 'ok');
    });
    r.task('foo', function() {
      this.scratch['foo'] = (this.scratch['foo'] != 'ok' ? 'err' : 'ok-ok');
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke both task functions with shared scratch', function() {
        r.scratch.foo.should.equal('ok-ok');
      })
    })
  })
  
  describe('with task that has a dependency', function() {
    var r = new rivet.Rivet();
    r.task('f', function() {
      this.scratch['test'] = 'f';
    });
    r.task('foo', 'f', function() {
      this.scratch['test'] = this.scratch['test'] + '-foo';
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependency followed by task', function() {
        r.scratch.test.should.equal('f-foo');
      })
    })
  })
  
  describe('with task that has multiple dependencies declared with a string', function() {
    var r = new rivet.Rivet();
    r.task('f', function() {
      this.scratch['test'] = 'f';
    });
    r.task('o', function() {
      this.scratch['test'] = this.scratch['test'] + '-o';
    });
    r.task('foo', 'f o', function() {
      this.scratch['test'] = this.scratch['test'] + '-foo';
    });
    
    before(function(done) {
      r.run('foo', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependencies followed by task', function() {
        r.scratch.test.should.equal('f-o-foo');
      })
    })
  })
  
  describe('with task that has multiple dependencies declared with an array', function() {
    var r = new rivet.Rivet();
    r.task('b', function() {
      this.scratch['test'] = 'b';
    });
    r.task('a', function() {
      this.scratch['test'] = this.scratch['test'] + '-a';
    });
    r.task('bar', ['b', 'a'], function() {
      this.scratch['test'] = this.scratch['test'] + '-bar';
    });
    
    before(function(done) {
      r.run('bar', function(err) {
        if (err) return done(err);
        return done();
      });
    })
    
    describe('result', function() {
      it('should invoke dependencies followed by task', function() {
        r.scratch.test.should.equal('b-a-bar');
      })
    })
  })
  
})
