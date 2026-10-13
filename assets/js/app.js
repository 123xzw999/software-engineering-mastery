/* ===========================================================
   软件工程全栈知识系统 · 应用逻辑
   原生 JS，零依赖，支持 file:// 直接打开
   =========================================================== */
(function () {
  'use strict';

  var LS_KEY = 'se_mastery_v1';
  var AUTH = { u: '123456', p: 'xiaoxiong888' };

  var DOMAINS = (window.SE_BANK || []).slice();
  var PROJECTS = window.SE_PROJECTS || [];
  var COURSES = window.SE_COURSES || { platforms: [], books: [], byDomain: {}, paths: [] };

  var TIER_LABEL = { core: '本科核心', advanced: '进阶', master: '硕士层次', industry: '大厂实践' };

  /* ---------------- 索引 ---------------- */
  var QIDX = {};          // qid -> {q, d, c}
  var DOM_IDX = {};
  DOMAINS.forEach(function (d) {
    DOM_IDX[d.id] = d;
    d.chapters.forEach(function (c) {
      c.questions.forEach(function (q) {
        QIDX[q.id] = { q: q, d: d, c: c };
      });
    });
  });

  /* ---------------- 状态 ---------------- */
  var mem = {};
  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return mem[k] || null; }
  }
  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) { mem[k] = v; }
  }

  var S = {
    user: null,
    view: 'dash',
    prog: {},      // qid -> 1 正确 / 0 错误
    wrong: {},     // qid -> {n: 次数, t: 时间}
    fav: {},       // qid -> 时间戳
    self: {},      // qid -> 0 / 0.5 / 1 （简答题自评）
    quiz: null,
    curDomain: null,
    curProject: null,
    searchQ: '',
    examCfg: { count: 20, scope: 'all' }
  };

  function save() {
    lsSet(LS_KEY, JSON.stringify({
      user: S.user, prog: S.prog, wrong: S.wrong, fav: S.fav, self: S.self
    }));
  }
  function load() {
    var raw = lsGet(LS_KEY);
    if (!raw) return;
    try {
      var o = JSON.parse(raw);
      S.user = o.user || null;
      S.prog = o.prog || {};
      S.wrong = o.wrong || {};
      S.fav = o.fav || {};
      S.self = o.self || {};
    } catch (e) { /* ignore */ }
  }

  /* ---------------- 工具 ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function toast(msg) {
    var t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._tm);
    t._tm = setTimeout(function () { t.classList.remove('show'); }, 1900);
  }

  var TYPE_LABEL = { single: '单选', multi: '多选', judge: '判断', essay: '简答' };
  function typeLabel(q) { return q.type === 'judge' ? '判断' : (TYPE_LABEL[q.type] || '单选'); }

  function allQuestions() {
    var arr = [];
    DOMAINS.forEach(function (d) {
      d.chapters.forEach(function (c) {
        c.questions.forEach(function (q) { arr.push(q); });
      });
    });
    return arr;
  }
  var ALLQ = allQuestions();

  /* ---------------- 统计 ---------------- */
  function domStats(d) {
    var total = 0, done = 0, correct = 0;
    d.chapters.forEach(function (c) {
      c.questions.forEach(function (q) {
        total++;
        if (S.prog[q.id] !== undefined) { done++; if (S.prog[q.id] === 1) correct++; }
      });
    });
    return { total: total, done: done, correct: correct, rate: pct(done, total), acc: pct(correct, done) };
  }
  function overall() {
    var total = ALLQ.length, done = 0, correct = 0;
    ALLQ.forEach(function (q) {
      if (S.prog[q.id] !== undefined) { done++; if (S.prog[q.id] === 1) correct++; }
    });
    return {
      total: total, done: done, correct: correct,
      rate: pct(done, total), acc: pct(correct, done),
      wrongCount: Object.keys(S.wrong).length,
      favCount: Object.keys(S.fav).length
    };
  }
  function chapterStats(c) {
    var total = c.questions.length, done = 0, correct = 0;
    c.questions.forEach(function (q) {
      if (S.prog[q.id] !== undefined) { done++; if (S.prog[q.id] === 1) correct++; }
    });
    return { total: total, done: done, correct: correct, rate: pct(done, total) };
  }

  /* ---------------- 顶栏 ---------------- */
  var NAV = [
    { k: 'dash', t: '首页' },
    { k: 'domains', t: '知识域' },
    { k: 'projects', t: '项目实战' },
    { k: 'courses', t: '课程与书单' },
    { k: 'paths', t: '学习路线' },
    { k: 'wrong', t: '错题本' },
    { k: 'fav', t: '收藏夹' }
  ];

  function renderTop() {
    var html = '<div class="tb-brand"><div class="tb-logo">SE</div><span>软件工程全栈知识系统</span></div><div class="tb-nav">';
    NAV.forEach(function (n) {
      var on = (S.view === n.k) || (n.k === 'domains' && S.view === 'domain');
      html += '<button class="' + (on ? 'on' : '') + '" data-nav="' + n.k + '">' + n.t + '</button>';
    });
    html += '</div><div class="tb-right">' +
      '<div class="search-box"><span class="ico">&#9906;</span><input id="globalSearch" type="text" placeholder="搜索题目 / 知识点 / 课程" value="' + esc(S.searchQ) + '"></div>' +
      '<button class="btn btn-sm" data-act="exam-quick">随机测验</button>' +
      '<div class="user-chip"><span class="av">小</span>' + esc(S.user || '小熊') + '</div>' +
      '<button class="btn btn-sm btn-ghost" data-act="logout">退出</button>' +
      '</div>';
    return html;
  }

  /* ---------------- 首页 ---------------- */
  function renderDash() {
    var st = overall();
    var html = '';
    html += '<div class="hero">' +
      '<div class="hero-title">软件工程全栈知识系统</div>' +
      '<div class="hero-slogan">从写代码到做工程 需要的不是天赋 而是体系与刻意练习</div>' +
      '<div class="hero-dash">——把知识变成能力</div>' +
      '<div class="hero-meta">' +
      '<span class="pill">知识域 <b>' + DOMAINS.length + '</b></span>' +
      '<span class="pill">章节 <b>' + DOMAINS.reduce(function (a, d) { return a + d.chapters.length; }, 0) + '</b></span>' +
      '<span class="pill">题目 <b>' + st.total + '</b></span>' +
      '<span class="pill">项目案例 <b>' + PROJECTS.length + '</b></span>' +
      '<span class="pill">覆盖本科 → 硕士 → 大厂</span>' +
      '</div></div>';

    html += '<div class="stat-row">' +
      statBox('总进度', st.rate + '<small>%</small>', st.done + ' / ' + st.total + ' 题', true) +
      statBox('正确率', st.acc + '<small>%</small>', '答对 ' + st.correct + ' 题') +
      statBox('错题待复习', String(st.wrongCount), '需要重做') +
      statBox('已收藏', String(st.favCount), '重点标记') +
      '</div>';

    html += '<div class="section-head"><h2>知识域地图</h2><span class="sub">点击进入章节刷题 · 覆盖本科专业课到硕士研究方向</span></div>';
    html += '<div class="grid grid-3">';
    DOMAINS.forEach(function (d) {
      var ds = domStats(d);
      html += '<div class="card dom-card" data-domain="' + d.id + '">' +
        '<span class="tier-tag tier-' + d.tier + '">' + (TIER_LABEL[d.tier] || '') + '</span>' +
        '<div class="dom-top"><div class="dom-ico">' + esc(d.icon) + '</div>' +
        '<div><div class="dom-name">' + esc(d.name) + '</div><div class="dom-short">' + esc(d.short) + '</div></div></div>' +
        '<div class="dom-desc">' + esc(d.summary) + '</div>' +
        '<div class="dom-foot"><div class="progress-bar"><i style="width:' + ds.rate + '%"></i></div>' +
        '<b>' + ds.done + '/' + ds.total + '</b></div>' +
        '</div>';
    });
    html += '</div>';

    // 继续学习 / 推荐
    html += '<div class="section-head"><h2>建议下一步</h2><span class="sub">基于你的答题记录</span></div>';
    html += '<div class="grid grid-2">';
    var rec = recommend();
    if (rec.wrong.length) {
      html += '<div class="card"><div class="panel-title">复习错题</div><div class="panel-sub">有 ' + rec.wrong.length + ' 道错题等待重做</div>' +
        '<button class="btn btn-primary btn-sm" data-act="start-wrong">开始错题重做</button></div>';
    }
    if (rec.domain) {
      var rd = DOM_IDX[rec.domain];
      html += '<div class="card"><div class="panel-title">继续学习：' + esc(rd.name) + '</div>' +
        '<div class="panel-sub">该域完成度 ' + domStats(rd).rate + '%，还有题目未做</div>' +
        '<button class="btn btn-primary btn-sm" data-domain="' + rd.id + '">进入该知识域</button></div>';
    }
    html += '<div class="card"><div class="panel-title">项目实战</div><div class="panel-sub">' + PROJECTS.length + ' 个端到端项目：需求 → 架构 → 数据模型 → 接口 → 测试 → 部署 → 面试考点</div>' +
      '<button class="btn btn-primary btn-sm" data-nav="projects">打开项目库</button></div>';
    html += '<div class="card"><div class="panel-title">课程与书单</div><div class="panel-sub">每个知识域对应的国内外课程平台与具体课程、经典书籍</div>' +
      '<button class="btn btn-primary btn-sm" data-nav="courses">查看课程地图</button></div>';
    html += '</div>';
    return html;
  }

  function statBox(k, v, sub, grad) {
    return '<div class="stat"><div class="k">' + k + '</div><div class="v' + (grad ? ' v-c1' : '') + '">' + v + '</div><div class="k" style="margin-top:4px">' + sub + '</div></div>';
  }

  function recommend() {
    var wrongIds = Object.keys(S.wrong);
    var best = null, bestRate = 101;
    DOMAINS.forEach(function (d) {
      var ds = domStats(d);
      if (ds.done < ds.total) {
        if (ds.rate < bestRate) { bestRate = ds.rate; best = d.id; }
      }
    });
    return { wrong: wrongIds, domain: best };
  }

  /* ---------------- 知识域列表 ---------------- */
  function renderDomains() {
    var html = '<div class="section-head"><h2>知识域</h2><span class="sub">共 ' + DOMAINS.length + ' 个域 · 按本科核心 → 进阶 → 硕士 → 大厂实践递进</span></div>';
    var groups = [['core', '本科专业核心课'], ['advanced', '进阶与工程能力'], ['master', '硕士层次与研究方向'], ['industry', '大厂工程实践']];
    groups.forEach(function (g) {
      var list = DOMAINS.filter(function (d) { return d.tier === g[0]; });
      if (!list.length) return;
      html += '<div class="section-head" style="margin-top:30px"><h2 style="font-size:15.5px">' + g[1] + '</h2><span class="sub">' + list.length + ' 个域</span></div>';
      html += '<div class="grid grid-3">';
      list.forEach(function (d) {
        var ds = domStats(d);
        html += '<div class="card dom-card" data-domain="' + d.id + '">' +
          '<div class="dom-top"><div class="dom-ico">' + esc(d.icon) + '</div>' +
          '<div><div class="dom-name">' + esc(d.name) + '</div><div class="dom-short">' + esc(d.short) + ' · 建议 ' + d.hours + ' 小时</div></div></div>' +
          '<div class="dom-desc">' + esc(d.summary) + '</div>' +
          '<div class="dom-foot"><div class="progress-bar"><i style="width:' + ds.rate + '%"></i></div><b>' + ds.done + '/' + ds.total + '</b></div>' +
          '</div>';
      });
      html += '</div>';
    });
    return html;
  }

  /* ---------------- 域详情 ---------------- */
  function renderDomain() {
    var d = DOM_IDX[S.curDomain];
    if (!d) { S.view = 'domains'; return renderDomains(); }
    var ds = domStats(d);
    var html = '<button class="btn btn-sm btn-ghost" data-nav="domains" style="margin-bottom:18px">&#8592; 返回知识域</button>';
    html += '<div class="panel"><div class="panel-title" style="font-size:20px">' + esc(d.name) +
      ' <span class="tier-tag tier-' + d.tier + '" style="position:static;margin-left:8px">' + (TIER_LABEL[d.tier] || '') + '</span></div>' +
      '<div class="panel-sub">' + esc(d.short) + ' · 建议学习 ' + d.hours + ' 小时 · 共 ' + d.chapters.length + ' 章 ' + ds.total + ' 题</div>' +
      '<div style="font-size:13.6px;color:var(--text-2);line-height:1.9;margin-bottom:18px">' + esc(d.summary) + '</div>' +
      '<div class="dom-foot" style="margin-bottom:20px"><div class="progress-bar"><i style="width:' + ds.rate + '%"></i></div><b>' + ds.done + '/' + ds.total + '（' + ds.rate + '%）</b></div>' +
      '<div class="q-actions"><button class="btn btn-primary btn-sm" data-act="start-domain-practice">练习模式（逐题解析）</button>' +
      '<button class="btn btn-sm" data-act="start-domain-exam">测验模式（整域批改）</button>' +
      '<button class="btn btn-sm btn-ghost" data-act="go-courses">看对应课程</button></div></div>';

    html += '<div class="section-head"><h2>章节</h2><span class="sub">点击章节开始刷题</span></div><div class="chapter-list">';
    d.chapters.forEach(function (c, i) {
      var cs = chapterStats(c);
      html += '<div class="chapter-item" data-chapter="' + c.id + '">' +
        '<span class="idx">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<div style="min-width:0"><div class="nm">' + esc(c.name) + '</div>' +
        '<div class="pts">' + (c.points || []).map(function (p) { return esc(p); }).join(' · ') + '</div></div>' +
        '<span class="cnt">' + cs.done + '/' + cs.total + '</span></div>';
    });
    html += '</div>';
    return html;
  }

  /* ---------------- 答题 ---------------- */
  function buildQuiz(opts) {
    var list = opts.list.slice();
    if (opts.shuffle !== false) shuffle(list);
    if (opts.limit) list = list.slice(0, opts.limit);
    S.quiz = {
      title: opts.title || '练习',
      mode: opts.mode || 'practice',
      list: list,
      idx: 0,
      answers: {},
      revealed: {},
      submitted: false,
      selfScores: {},
      startTs: Date.now()
    };
    S.view = 'quiz';
    render();
  }

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function sameSet(a, b) {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    var x = a.slice().sort(), y = b.slice().sort();
    for (var i = 0; i < x.length; i++) if (x[i] !== y[i]) return false;
    return true;
  }

  function gradeOne(q, ans) {
    if (q.type === 'essay') return null;
    return sameSet(ans, q.answer);
  }

  function renderQuiz() {
    var z = S.quiz;
    if (!z) { S.view = 'dash'; return renderDash(); }
    var qid = z.list[z.idx];
    var rec = QIDX[qid];
    var q = rec.q;
    var ans = z.answers[qid] || [];
    var revealed = !!z.revealed[qid];
    var isExam = z.mode === 'exam';
    var locked = isExam ? false : revealed;

    var html = '<div class="q-wrap">';
    html += '<div class="q-head">' +
      '<span class="num">' + (z.idx + 1) + ' / ' + z.list.length + '</span>' +
      '<div class="bar"><i style="width:' + pct(z.idx + (revealed || isExam ? 1 : 0), z.list.length) + '%"></i></div>' +
      '<span class="tag tag-type">' + typeLabel(q) + '</span>' +
      '<span class="tag tag-lv' + (q.level || 1) + '">难度 ' + (q.level || 1) + '</span>' +
      '<button class="btn btn-sm btn-ghost" data-act="fav" data-qid="' + qid + '">' + (S.fav[qid] ? '已收藏' : '收藏') + '</button>' +
      '<button class="btn btn-sm btn-ghost" data-act="exit-quiz">退出</button>' +
      '</div>';
    html += '<div class="panel">';
    html += '<div style="font-size:11.5px;color:var(--text-3);letter-spacing:.6px;margin-bottom:8px">' + esc(rec.d.name) + ' · ' + esc(rec.c.name) + (z.mode === 'exam' ? ' · 测验模式' : ' · 练习模式') + '</div>';
    html += '<div class="q-stem">' + esc(q.stem) + '</div>';

    if (q.type === 'essay') {
      var val = (ans && ans.text) || '';
      html += '<div class="essay-area"><textarea id="essayInput" placeholder="写下你的答案要点（考试模式交卷后统一给参考答案；练习模式提交后立即查看）">' + esc(val) + '</textarea></div>';
    } else {
      (q.options || []).forEach(function (op, i) {
        var cls = 'opt' + (q.type === 'multi' ? ' multi' : '');
        if (ans.indexOf(i) >= 0) cls += ' sel';
        if (revealed) {
          var isRight = q.answer.indexOf(i) >= 0;
          cls = cls.replace(' sel', '');
          if (isRight) cls += ' right'; else if (ans.indexOf(i) >= 0) cls += ' wrong';
          cls += ' locked';
        }
        html += '<div class="' + cls + '" data-opt="' + i + '">' +
          '<span class="mark">' + String.fromCharCode(65 + i) + '</span><span>' + esc(op) + '</span></div>';
      });
    }

    // 反馈区
    if (revealed && q.type !== 'essay') {
      var ok = gradeOne(q, ans);
      html += '<div class="feedback ' + (ok ? 'fb-right' : 'fb-wrong') + '">' +
        '<div class="fb-t"><span class="dot"></span>' + (ok ? '回答正确' : '回答错误') + '</div>' +
        '<div class="fb-b"><strong>正确答案：</strong>' + q.answer.map(function (i) { return String.fromCharCode(65 + i); }).join('、') + '\n' + esc(q.explain || '') + '</div></div>';
    }
    if (revealed && q.type === 'essay') {
      html += '<div class="feedback fb-info"><div class="fb-t"><span class="dot"></span>参考答案与评分要点</div>' +
        '<div class="ref-ans">' + esc(q.answer) + '</div>' +
        (q.explain ? '<div class="fb-b" style="margin-top:12px"><strong>评分要点：</strong>' + esc(q.explain) + '</div>' : '') +
        '</div>';
      html += '<div class="self-score"><span>自评掌握程度：</span>' +
        selfBtn(qid, 1, '完全掌握', z.selfScores[qid]) +
        selfBtn(qid, 0.5, '部分掌握', z.selfScores[qid]) +
        selfBtn(qid, 0, '尚未掌握', z.selfScores[qid]) + '</div>';
    }

    // 操作
    html += '<div class="q-actions">';
    html += '<button class="btn btn-sm btn-ghost" data-act="prev"' + (z.idx === 0 ? ' disabled' : '') + '>上一题</button>';
    if (!revealed && !isExam) {
      html += '<button class="btn btn-primary" data-act="submit-answer">提交答案</button>';
    }
    if (!revealed && isExam) {
      html += '<span style="font-size:12.5px;color:var(--text-3)">测验模式：作答后可直接下一题，最后统一交卷批改</span>';
    }
    html += '<div class="spacer"></div>';
    if (z.idx < z.list.length - 1) {
      html += '<button class="btn btn-primary" data-act="next">下一题</button>';
    } else {
      html += '<button class="btn btn-primary" data-act="finish">' + (isExam ? '交卷批改' : '完成练习') + '</button>';
    }
    html += '</div></div></div>';
    return html;
  }

  function selfBtn(qid, v, label, cur) {
    return '<button data-act="self" data-qid="' + qid + '" data-v="' + v + '" class="' + (cur === v ? 'on' : '') + '">' + label + '</button>';
  }

  /* ---------------- 结果页 ---------------- */
  function renderResult() {
    var z = S.quiz;
    if (!z || !z.result) { S.view = 'dash'; return renderDash(); }
    var r = z.result;
    var html = '<div class="q-wrap">';
    html += '<div class="panel score-hero"><div class="score-big">' + r.score + '</div>' +
      '<div class="score-sub">' + esc(z.title) + ' · 共 ' + r.total + ' 题</div>' +
      '<div class="score-grid">' +
      statBox('正确', String(r.correct), '题') +
      statBox('错误', String(r.wrong), '题') +
      statBox('正确率', r.acc + '<small>%</small>', '客观题') +
      statBox('简答题', String(r.essay), '需自评') +
      '</div>' +
      '<div class="q-actions" style="justify-content:center;margin-top:24px">' +
      '<button class="btn btn-primary" data-act="restart-quiz">再来一轮</button>' +
      '<button class="btn" data-act="review-wrong">查看错题</button>' +
      '<button class="btn btn-ghost" data-act="exit-quiz">返回首页</button>' +
      '</div></div>';

    html += '<div class="section-head"><h2>逐题回顾</h2><span class="sub">点击题目可展开解析</span></div>';
    z.list.forEach(function (qid, i) {
      var rec = QIDX[qid]; var q = rec.q;
      var ans = z.answers[qid] || [];
      var g = gradeOne(q, ans);
      var mark = q.type === 'essay' ? '简答' : (g ? '正确' : '错误');
      var cls = q.type === 'essay' ? '' : (g ? 'good' : 'bad');
      html += '<div class="mini-q" data-toggle-review="' + qid + '">' +
        '<div class="mq-stem">' + (i + 1) + '. ' + esc(q.stem) + '</div>' +
        '<div class="mq-meta"><span class="' + cls + '">' + mark + '</span>' +
        '<span>' + esc(rec.d.name) + '</span><span>' + esc(rec.c.name) + '</span><span>' + typeLabel(q) + '</span></div>' +
        '<div class="rev-body hidden" id="rev-' + qid + '" style="margin-top:12px;font-size:13.3px;line-height:1.9;color:var(--text-2)">' +
        '<div><strong>你的作答：</strong>' + (q.type === 'essay' ? esc((ans && ans.text) || '（未作答）') : (ans.length ? ans.map(function (x) { return String.fromCharCode(65 + x); }).join('、') : '（未作答）')) + '</div>' +
        (q.type !== 'essay' ? '<div><strong>正确答案：</strong>' + q.answer.map(function (x) { return String.fromCharCode(65 + x); }).join('、') + '</div>' : '') +
        '<div class="ref-ans">' + esc(q.answer) + '</div>' +
        (q.explain ? '<div style="margin-top:10px"><strong>解析：</strong>' + esc(q.explain) + '</div>' : '') +
        '</div></div>';
    });
    html += '</div>';
    return html;
  }

  /* ---------------- 错题本 / 收藏 ---------------- */
  function renderWrong() {
    var ids = Object.keys(S.wrong).sort(function (a, b) { return (S.wrong[b].t || 0) - (S.wrong[a].t || 0); });
    var html = '<div class="section-head"><h2>错题本</h2><span class="sub">共 ' + ids.length + ' 题 · 答对后自动移出</span></div>';
    if (!ids.length) return html + emptyBox('还没有错题，继续加油');
    html += '<div class="q-actions" style="margin-bottom:18px"><button class="btn btn-primary btn-sm" data-act="start-wrong">开始错题重做（' + ids.length + ' 题）</button>' +
      '<button class="btn btn-sm btn-ghost" data-act="clear-wrong">清空错题本</button></div>';
    ids.forEach(function (qid) {
      var rec = QIDX[qid]; if (!rec) return;
      var w = S.wrong[qid];
      html += '<div class="mini-q" data-jump="' + qid + '">' +
        '<div class="mq-stem">' + esc(rec.q.stem) + '</div>' +
        '<div class="mq-meta"><span class="bad">错 ' + (w.n || 1) + ' 次</span><span>' + esc(rec.d.name) + '</span>' +
        '<span>' + esc(rec.c.name) + '</span><span>' + typeLabel(rec.q) + '</span></div></div>';
    });
    return html;
  }

  function renderFav() {
    var ids = Object.keys(S.fav).sort(function (a, b) { return S.fav[b] - S.fav[a]; });
    var html = '<div class="section-head"><h2>收藏夹</h2><span class="sub">共 ' + ids.length + ' 题</span></div>';
    if (!ids.length) return html + emptyBox('还没有收藏题目，在答题时点「收藏」即可');
    html += '<div class="q-actions" style="margin-bottom:18px"><button class="btn btn-primary btn-sm" data-act="start-fav">开始刷收藏题</button></div>';
    ids.forEach(function (qid) {
      var rec = QIDX[qid]; if (!rec) return;
      html += '<div class="mini-q" data-jump="' + qid + '">' +
        '<div class="mq-stem">' + esc(rec.q.stem) + '</div>' +
        '<div class="mq-meta"><span>' + esc(rec.d.name) + '</span><span>' + esc(rec.c.name) + '</span><span>' + typeLabel(rec.q) + '</span></div></div>';
    });
    return html;
  }

  function emptyBox(txt) {
    return '<div class="empty"><div class="big">&#9671;</div>' + esc(txt) + '</div>';
  }

  /* ---------------- 项目库 ---------------- */
  function renderProjects() {
    var html = '<div class="section-head"><h2>专业项目案例库</h2><span class="sub">' + PROJECTS.length + ' 个端到端项目 · 从需求到上线到面试考点</span></div>';
    html += '<div class="grid grid-2">';
    PROJECTS.forEach(function (p) {
      html += '<div class="card proj-card" data-project="' + p.id + '">' +
        '<div class="proj-name">' + esc(p.name) + '</div>' +
        '<div class="proj-tag">' + esc(p.tag) + '</div>' +
        '<div class="proj-sum">' + esc(p.summary) + '</div>' +
        '<div class="proj-meta"><span>难度 <b>' + esc(p.level) + '</b></span><span>周期 <b>' + esc(p.weeks) + '</b></span>' +
        '<span>团队 <b>' + esc((p.roles || []).length ? p.roles[0] : '—') + '</b></span></div>' +
        '</div>';
    });
    html += '</div>';
    return html;
  }

  function renderProjectDetail() {
    var p = null;
    PROJECTS.forEach(function (x) { if (x.id === S.curProject) p = x; });
    if (!p) { S.view = 'projects'; return renderProjects(); }
    var html = '<button class="btn btn-sm btn-ghost" data-nav="projects" style="margin-bottom:18px">&#8592; 返回项目库</button>';
    html += '<div class="panel"><div class="panel-title" style="font-size:21px">' + esc(p.name) + '</div>' +
      '<div class="panel-sub">' + esc(p.tag) + ' · 难度 ' + esc(p.level) + ' · 建议周期 ' + esc(p.weeks) + '</div>' +
      '<div style="font-size:13.8px;color:var(--text-2);line-height:1.95">' + esc(p.summary) + '</div>' +
      '<div class="q-actions" style="margin-top:20px">' + (p.relatedDomains || []).map(function (id) {
        var d = DOM_IDX[id]; if (!d) return '';
        return '<button class="btn btn-sm btn-ghost" data-domain="' + id + '">关联知识域：' + esc(d.name) + '</button>';
      }).join('') + '</div></div>';

    html += '<div class="grid grid-2">';

    html += '<div class="panel"><div class="detail-section"><h3>业务背景</h3><div style="font-size:13.6px;color:var(--text-2);line-height:1.95">' + esc(p.business) + '</div></div>' +
      '<div class="detail-section"><h3>技术栈</h3><div class="stack-row">' + (p.stack || []).map(function (s) { return '<span>' + esc(s) + '</span>'; }).join('') + '</div></div>' +
      '<div class="detail-section"><h3>规模与角色</h3><dl class="kv"><dt>规模</dt><dd>' + esc(p.scale) + '</dd><dt>团队配置</dt><dd>' + (p.roles || []).map(esc).join('、') + '</dd></dl></div></div>';

    html += '<div class="panel"><div class="detail-section"><h3>需求清单（功能 / 非功能）</h3><ul>' +
      (p.requirements || []).map(function (r) { return '<li><b style="color:' + (r.type === '非功能' ? 'var(--amber)' : 'var(--cyan)') + '">[' + esc(r.type) + ']</b> ' + esc(r.text) + '</li>'; }).join('') +
      '</ul></div></div>';

    html += '</div>';

    var a = p.architecture || {};
    html += '<div class="panel"><div class="detail-section"><h3>架构分层</h3><ul>' + (a.layers || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="detail-section"><h3>关键架构决策</h3><ul>' + (a.decisions || []).map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul></div></div>';

    html += '<div class="panel"><div class="detail-section"><h3>数据模型</h3>' +
      '<table class="table"><thead><tr><th>表</th><th>关键字段</th><th>设计说明</th></tr></thead><tbody>' +
      (p.dataModel || []).map(function (t) {
        return '<tr><td><b>' + esc(t.table) + '</b></td><td style="font-family:var(--mono);font-size:12px">' + esc(t.fields) + '</td><td>' + esc(t.note) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';

    html += '<div class="panel"><div class="detail-section"><h3>核心接口</h3>' +
      '<table class="table"><thead><tr><th>方法</th><th>路径</th><th>说明</th></tr></thead><tbody>' +
      (p.apis || []).map(function (x) {
        return '<tr><td><b style="font-family:var(--mono);font-size:12px;color:var(--teal)">' + esc(x.method) + '</b></td>' +
          '<td style="font-family:var(--mono);font-size:12px">' + esc(x.path) + '</td><td>' + esc(x.desc) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';

    html += '<div class="panel"><div class="detail-section"><h3>测试策略</h3><ul>' + (p.tests || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div class="detail-section"><h3>里程碑</h3>' + (p.milestones || []).map(function (m) {
        return '<div class="ms-item"><span class="ph">' + esc(m.phase) + '</span><span class="dl">' + esc(m.deliverable) + '</span><span class="wk">' + esc(String(m.weeks)) + ' 周</span></div>';
      }).join('') + '</div></div>';

    html += '<div class="panel"><div class="detail-section"><h3>常见踩坑点</h3>' +
      (p.pitfalls || []).map(function (x) { return '<div class="pitfall"><span class="x">&#10007;</span><span>' + esc(x) + '</span></div>'; }).join('') +
      '</div><div class="detail-section"><h3>面试考点</h3>' +
      (p.interview || []).map(function (x) {
        return '<div class="qa-item"><div class="q">Q：' + esc(x.q) + '</div><div class="a">' + esc(x.a) + '</div></div>';
      }).join('') + '</div></div>';

    return html;
  }

  /* ---------------- 课程与书单 ---------------- */
  function renderCourses() {
    var html = '<div class="section-head"><h2>课程地图</h2><span class="sub">每个知识域对应的平台、课程与经典书籍</span></div>';

    html += '<div class="panel"><div class="detail-section"><h3>推荐平台</h3><div class="grid grid-3" style="gap:12px">' +
      (COURSES.platforms || []).map(function (p) {
        return '<div class="course-item" style="margin:0"><div class="ci-l"><div class="ci-n">' + esc(p.name) + '</div>' +
          '<div class="ci-p">' + esc(p.lang) + '</div><div class="ci-d">' + esc(p.note) + '</div></div>' +
          '<div class="ci-r">' + (p.url ? '<a class="go-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">打开</a>' : '') + '</div></div>';
      }).join('') + '</div></div></div>';

    html += '<div class="section-head"><h2>按知识域选课</h2><span class="sub">17 个域的课程与书籍清单</span></div>';
    DOMAINS.forEach(function (d) {
      var c = (COURSES.byDomain || {})[d.id];
      if (!c) return;
      html += '<div class="panel"><div class="panel-title">' + esc(d.name) + ' <span class="tag tag-type" style="margin-left:8px">' + (TIER_LABEL[d.tier] || '') + '</span></div>' +
        '<div class="panel-sub">' + (c.courses || []).length + ' 门课程 / 资源</div>';
      (c.courses || []).forEach(function (x) {
        html += '<div class="course-item"><div class="ci-l"><div class="ci-n">' + esc(x.name) + '</div>' +
          '<div class="ci-p">' + esc(x.platform) + '</div><div class="ci-d">' + esc(x.note) + '</div></div>' +
          '<div class="ci-r">' + (x.url ? '<a class="go-link" href="' + esc(x.url) + '" target="_blank" rel="noopener">去学习</a>' : '<span class="tag">书籍</span>') + '</div></div>';
      });
      html += '<div class="q-actions" style="margin-top:14px"><button class="btn btn-sm btn-ghost" data-domain="' + d.id + '">去做该域题目</button></div></div>';
    });

    html += '<div class="section-head"><h2>经典书单</h2><span class="sub">' + (COURSES.books || []).length + ' 本 · 按学习阶段排序</span></div>';
    html += '<div class="panel"><table class="table"><thead><tr><th>书名</th><th>作者</th><th>说明</th><th>阶段</th></tr></thead><tbody>' +
      (COURSES.books || []).map(function (b) {
        return '<tr><td><b>' + esc(b.title) + '</b></td><td>' + esc(b.author) + '</td><td>' + esc(b.note) + '</td><td><span class="tag">' + esc(b.level) + '</span></td></tr>';
      }).join('') + '</tbody></table></div>';
    return html;
  }

  /* ---------------- 学习路线 ---------------- */
  function renderPaths() {
    var html = '<div class="section-head"><h2>学习路线</h2><span class="sub">三条可选路线 · 按阶段推进，每阶段都有明确产出</span></div>';
    (COURSES.paths || []).forEach(function (p) {
      html += '<div class="panel"><div class="panel-title" style="font-size:18px">' + esc(p.name) + '</div>' +
        '<div class="panel-sub">适合：' + esc(p.for) + ' · 总周期约 ' + p.totalWeeks + ' 周</div>';
      (p.stages || []).forEach(function (s) {
        html += '<div class="ms-item" style="flex-direction:column;gap:8px"><div style="display:flex;width:100%;gap:14px;align-items:baseline">' +
          '<span class="ph" style="min-width:auto">' + esc(s.name) + '</span></div>' +
          '<div class="dl" style="color:var(--text)">目标：' + esc(s.goal) + '</div>' +
          (s.domains && s.domains.length ? '<div class="stack-row">' + s.domains.map(function (id) {
            var d = DOM_IDX[id]; if (!d) return '';
            return '<span data-domain="' + id + '" style="cursor:pointer">' + esc(d.name) + '</span>';
          }).join('') + '</div>' : '') +
          (s.extra && s.extra.length ? '<ul style="list-style:none;display:flex;flex-direction:column;gap:6px;margin-top:4px">' +
            s.extra.map(function (e) { return '<li style="font-size:12.8px;color:var(--text-2);padding-left:16px;position:relative">' +
              '<span style="position:absolute;left:2px;color:var(--cyan)">&#8226;</span>' + esc(e) + '</li>'; }).join('') + '</ul>' : '') +
          '</div>';
      });
      html += '</div>';
    });
    return html;
  }

  /* ---------------- 搜索 ---------------- */
  function renderSearch() {
    var q = (S.searchQ || '').trim().toLowerCase();
    if (!q) { S.view = 'dash'; return renderDash(); }
    var res = [];
    ALLQ.forEach(function (x) {
      var rec = QIDX[x.id];
      var hay = (x.stem + ' ' + (x.options || []).join(' ') + ' ' + (x.tags || []).join(' ') + ' ' + rec.d.name + ' ' + rec.c.name).toLowerCase();
      if (hay.indexOf(q) >= 0) res.push({ type: 'q', id: x.id, t: x.stem, m: rec.d.name + ' · ' + rec.c.name });
    });
    Object.keys(COURSES.byDomain || {}).forEach(function (did) {
      var c = COURSES.byDomain[did];
      (c.courses || []).forEach(function (x, i) {
        var hay = (x.name + ' ' + x.platform + ' ' + x.note).toLowerCase();
        if (hay.indexOf(q) >= 0) res.push({ type: 'c', id: did, t: x.name, m: '课程 · ' + x.platform + ' · ' + c.name });
      });
    });
    PROJECTS.forEach(function (p) {
      var hay = (p.name + ' ' + p.tag + ' ' + p.summary + ' ' + (p.stack || []).join(' ')).toLowerCase();
      if (hay.indexOf(q) >= 0) res.push({ type: 'p', id: p.id, t: p.name, m: '项目 · ' + p.tag });
    });

    var html = '<div class="section-head"><h2>搜索「' + esc(S.searchQ) + '」</h2><span class="sub">找到 ' + res.length + ' 条结果</span></div>';
    if (!res.length) return html + emptyBox('没有匹配结果，换个关键词试试');
    html += '<div class="panel search-results">';
    res.slice(0, 120).forEach(function (r) {
      var attr = r.type === 'q' ? 'data-jump="' + r.id + '"' : (r.type === 'p' ? 'data-project="' + r.id + '"' : 'data-coursedomain="' + r.id + '"');
      html += '<div class="sr-item" ' + attr + '><div class="sr-t">' + esc(r.t) + '</div><div class="sr-m">' + esc(r.m) + '</div></div>';
    });
    html += '</div>';
    return html;
  }

  /* ---------------- 随机测验弹层 ---------------- */
  function openExamDialog() {
    var html = '<div class="panel" style="max-width:520px;margin:60px auto">' +
      '<div class="panel-title">随机测验</div><div class="panel-sub">从题库随机抽题，交卷后统一批改并给出逐题解析</div>' +
      '<div class="field"><label>题量</label><div class="q-actions" style="margin:0">' +
      [10, 20, 30, 50].map(function (n) {
        return '<button class="btn btn-sm ' + (S.examCfg.count === n ? 'btn-primary' : '') + '" data-act="exam-count" data-n="' + n + '">' + n + ' 题</button>';
      }).join('') + '</div></div>' +
      '<div class="field"><label>范围</label><div class="q-actions" style="margin:0;flex-wrap:wrap">' +
      '<button class="btn btn-sm ' + (S.examCfg.scope === 'all' ? 'btn-primary' : '') + '" data-act="exam-scope" data-s="all">全库</button>' +
      DOMAINS.map(function (d) {
        return '<button class="btn btn-sm ' + (S.examCfg.scope === d.id ? 'btn-primary' : '') + '" data-act="exam-scope" data-s="' + d.id + '">' + esc(d.name) + '</button>';
      }).join('') + '</div></div>' +
      '<div class="q-actions"><button class="btn btn-primary" data-act="exam-start">开始测验</button>' +
      '<button class="btn btn-ghost" data-act="exam-cancel">取消</button></div></div>';
    var host = $('#modal');
    host.innerHTML = '<div class="wrap" style="position:fixed;inset:0;background:rgba(3,5,10,.78);backdrop-filter:blur(8px);z-index:150;overflow-y:auto">' + html + '</div>';
    host.classList.remove('hidden');
  }
  function closeExamDialog() { var h = $('#modal'); h.innerHTML = ''; h.classList.add('hidden'); }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    var app = $('#app');
    if (!S.user) { $('#loginView').classList.remove('hidden'); app.classList.remove('active'); return; }
    $('#loginView').classList.add('hidden');
    app.classList.add('active');
    $('#topbar').innerHTML = renderTop();

    var body = '';
    switch (S.view) {
      case 'dash': body = renderDash(); break;
      case 'domains': body = renderDomains(); break;
      case 'domain': body = renderDomain(); break;
      case 'quiz': body = renderQuiz(); break;
      case 'result': body = renderResult(); break;
      case 'wrong': body = renderWrong(); break;
      case 'fav': body = renderFav(); break;
      case 'projects': body = renderProjects(); break;
      case 'project': body = renderProjectDetail(); break;
      case 'courses': body = renderCourses(); break;
      case 'paths': body = renderPaths(); break;
      case 'search': body = renderSearch(); break;
      default: body = renderDash();
    }
    $('#main').innerHTML = body;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- 交互 ---------------- */
  function curQ() {
    if (!S.quiz) return null;
    var qid = S.quiz.list[S.quiz.idx];
    return QIDX[qid];
  }

  function submitAnswer() {
    var z = S.quiz; if (!z) return;
    var qid = z.list[z.idx];
    var rec = QIDX[qid]; var q = rec.q;
    var ans = z.answers[qid];

    if (q.type === 'essay') {
      var ta = $('#essayInput');
      ans = { text: ta ? ta.value : '' };
      z.answers[qid] = ans;
      if (!ans.text.trim()) { toast('请先写下你的答案要点'); return; }
      z.revealed[qid] = true;
      render();
      return;
    }
    if (!ans || !ans.length) { toast('请先选择答案'); return; }

    var ok = gradeOne(q, ans);
    z.revealed[qid] = true;
    record(qid, ok);
    render();
  }

  function record(qid, ok) {
    S.prog[qid] = ok ? 1 : 0;
    if (ok) {
      if (S.wrong[qid]) delete S.wrong[qid];
    } else {
      var w = S.wrong[qid] || { n: 0, t: 0 };
      w.n++; w.t = Date.now();
      S.wrong[qid] = w;
    }
    save();
  }

  function nextQ() {
    var z = S.quiz; if (!z) return;
    if (z.idx < z.list.length - 1) { z.idx++; render(); }
    else finishQuiz();
  }

  function finishQuiz() {
    var z = S.quiz; if (!z) return;
    if (z.mode === 'exam' && !z.submitted) {
      // 统计
      var correct = 0, wrong = 0, essay = 0;
      z.list.forEach(function (qid) {
        var rec = QIDX[qid]; var q = rec.q;
        if (q.type === 'essay') { essay++; return; }
        var ok = gradeOne(q, z.answers[qid]);
        if (ok) correct++; else wrong++;
        record(qid, ok);
      });
      var obj = correct + wrong;
      z.submitted = true;
      z.result = { total: z.list.length, correct: correct, wrong: wrong, essay: essay, acc: pct(correct, obj), score: obj ? Math.round(correct / obj * 100) : 0 };
      S.view = 'result';
      render();
      toast('交卷完成：' + z.result.score + ' 分');
      return;
    }
    // 练习模式收尾
    var done = 0, ok2 = 0;
    z.list.forEach(function (qid) {
      if (z.revealed[qid]) { done++; if (S.prog[qid] === 1) ok2++; }
    });
    toast('本轮完成 ' + done + ' 题，正确 ' + ok2 + ' 题');
    S.view = 'dash';
    render();
  }

  function startDomain(mode) {
    var d = DOM_IDX[S.curDomain]; if (!d) return;
    var list = [];
    d.chapters.forEach(function (c) { c.questions.forEach(function (q) { list.push(q.id); }); });
    buildQuiz({ title: d.name + (mode === 'exam' ? ' · 测验' : ' · 练习'), list: list, mode: mode === 'exam' ? 'exam' : 'practice' });
  }
  function startChapter(cid) {
    var d = DOM_IDX[S.curDomain]; if (!d) return;
    var ch = null;
    d.chapters.forEach(function (c) { if (c.id === cid) ch = c; });
    if (!ch) return;
    buildQuiz({ title: ch.name, list: ch.questions.map(function (q) { return q.id; }), mode: 'practice' });
  }
  function startFromIds(ids, title, mode) {
    if (!ids.length) { toast('没有可练习的题目'); return; }
    buildQuiz({ title: title, list: ids, mode: mode || 'practice' });
  }

  function jumpTo(qid) {
    buildQuiz({ title: '单题回顾', list: [qid], mode: 'practice', shuffle: false });
  }

  /* ---------------- 事件绑定 ---------------- */
  function bindEvents() {
    // 登录
    $('#loginForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var u = $('#loginUser').value.trim();
      var p = $('#loginPass').value;
      if (u === AUTH.u && p === AUTH.p) {
        S.user = u; save(); $('#loginErr').textContent = ''; render();
      } else {
        $('#loginErr').textContent = '账号或密码不正确，请查看下方提示';
      }
    });

    // 全局委托
    document.addEventListener('click', function (e) {
      var t = e.target;
      var nav = t.closest('[data-nav]');
      if (nav) { S.view = nav.getAttribute('data-nav'); if (S.view !== 'search') S.searchQ = ''; render(); return; }
      var dom = t.closest('[data-domain]');
      if (dom) { S.curDomain = dom.getAttribute('data-domain'); S.view = 'domain'; render(); return; }
      var ch = t.closest('[data-chapter]');
      if (ch) { startChapter(ch.getAttribute('data-chapter')); return; }
      var pj = t.closest('[data-project]');
      if (pj) { S.curProject = pj.getAttribute('data-project'); S.view = 'project'; render(); return; }
      var jp = t.closest('[data-jump]');
      if (jp) { jumpTo(jp.getAttribute('data-jump')); return; }
      var cd = t.closest('[data-coursedomain]');
      if (cd) { S.curDomain = cd.getAttribute('data-coursedomain'); S.view = 'domain'; render(); return; }
      var rv = t.closest('[data-toggle-review]');
      if (rv) {
        var el = document.getElementById('rev-' + rv.getAttribute('data-toggle-review'));
        if (el) el.classList.toggle('hidden');
        return;
      }
      var opt = t.closest('[data-opt]');
      if (opt && S.quiz) {
        var z = S.quiz; var qid = z.list[z.idx]; var rec = QIDX[qid]; var q = rec.q;
        if (q.type === 'essay') return;
        if (z.revealed[qid] && z.mode !== 'exam') return;
        var i = parseInt(opt.getAttribute('data-opt'), 10);
        var cur = z.answers[qid] || [];
        if (q.type === 'multi') {
          var pos = cur.indexOf(i);
          if (pos >= 0) cur.splice(pos, 1); else cur.push(i);
          z.answers[qid] = cur;
        } else {
          z.answers[qid] = [i];
        }
        render();
        return;
      }
      var act = t.closest('[data-act]');
      if (act) { handleAction(act.getAttribute('data-act'), act); return; }
    });

    // 搜索
    document.addEventListener('input', function (e) {
      if (e.target && e.target.id === 'globalSearch') {
        S.searchQ = e.target.value;
        if (S.searchQ.trim()) { S.view = 'search'; render(); var inp = $('#globalSearch'); if (inp) { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); } }
      }
      if (e.target && e.target.id === 'essayInput' && S.quiz) {
        S.quiz.answers[S.quiz.list[S.quiz.idx]] = { text: e.target.value };
      }
    });

    // 键盘
    document.addEventListener('keydown', function (e) {
      if (S.view !== 'quiz' || !S.quiz) return;
      if (e.target && (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')) {
        if (e.key === 'Enter' && e.ctrlKey) { e.preventDefault(); submitAnswer(); }
        return;
      }
      var rec = curQ(); if (!rec) return;
      var q = rec.q;
      if (/^[1-9]$/.test(e.key)) {
        var i = parseInt(e.key, 10) - 1;
        if (q.type !== 'essay' && q.options && i < q.options.length) {
          var z = S.quiz; var qid = z.list[z.idx];
          if (z.revealed[qid] && z.mode !== 'exam') return;
          var cur = z.answers[qid] || [];
          if (q.type === 'multi') {
            var pos = cur.indexOf(i);
            if (pos >= 0) cur.splice(pos, 1); else cur.push(i);
            z.answers[qid] = cur;
          } else z.answers[qid] = [i];
          render();
        }
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        var zz = S.quiz; var qqid = zz.list[zz.idx];
        if (!zz.revealed[qqid] && zz.mode !== 'exam') submitAnswer();
        else nextQ();
      }
      if (e.key === 'ArrowRight') nextQ();
      if (e.key === 'ArrowLeft' && S.quiz.idx > 0) { S.quiz.idx--; render(); }
    });
  }

  function handleAction(a, el) {
    switch (a) {
      case 'logout':
        S.user = null; save(); render(); break;
      case 'fav': {
        var qid = el.getAttribute('data-qid');
        if (S.fav[qid]) delete S.fav[qid]; else S.fav[qid] = Date.now();
        save(); render(); toast(S.fav[qid] ? '已收藏' : '已取消收藏');
        break;
      }
      case 'exit-quiz':
        S.quiz = null; S.view = 'dash'; render(); break;
      case 'submit-answer': submitAnswer(); break;
      case 'next': nextQ(); break;
      case 'prev': if (S.quiz && S.quiz.idx > 0) { S.quiz.idx--; render(); } break;
      case 'finish': finishQuiz(); break;
      case 'self': {
        var qq = el.getAttribute('data-qid'); var v = parseFloat(el.getAttribute('data-v'));
        S.quiz.selfScores[qq] = v;
        S.self[qq] = v;
        S.prog[qq] = v >= 0.5 ? 1 : 0;
        if (v >= 0.5) { if (S.wrong[qq]) delete S.wrong[qq]; }
        else { var w = S.wrong[qq] || { n: 0, t: 0 }; w.n++; w.t = Date.now(); S.wrong[qq] = w; }
        save(); render();
        break;
      }
      case 'start-domain-practice': startDomain('practice'); break;
      case 'start-domain-exam': startDomain('exam'); break;
      case 'go-courses': S.view = 'courses'; render(); break;
      case 'start-wrong': startFromIds(Object.keys(S.wrong), '错题重做', 'practice'); break;
      case 'start-fav': startFromIds(Object.keys(S.fav), '收藏题练习', 'practice'); break;
      case 'clear-wrong':
        if (confirm('确定清空错题本吗？')) { S.wrong = {}; save(); render(); }
        break;
      case 'restart-quiz': {
        var title = S.quiz.title, list = S.quiz.list, mode = S.quiz.mode;
        buildQuiz({ title: title, list: list, mode: mode, shuffle: true });
        break;
      }
      case 'review-wrong': {
        var ids = [];
        S.quiz.list.forEach(function (qid) { if (S.prog[qid] === 0) ids.push(qid); });
        startFromIds(ids, '本次错题', 'practice');
        break;
      }
      case 'exam-quick': openExamDialog(); break;
      case 'exam-cancel': closeExamDialog(); break;
      case 'exam-count': S.examCfg.count = parseInt(el.getAttribute('data-n'), 10); openExamDialog(); break;
      case 'exam-scope': S.examCfg.scope = el.getAttribute('data-s'); openExamDialog(); break;
      case 'exam-start': {
        var scope = S.examCfg.scope;
        var list = [];
        if (scope === 'all') ALLQ.forEach(function (q) { list.push(q.id); });
        else if (DOM_IDX[scope]) DOM_IDX[scope].chapters.forEach(function (c) { c.questions.forEach(function (q) { list.push(q.id); }); });
        closeExamDialog();
        if (!list.length) { toast('该范围没有题目'); break; }
        buildQuiz({ title: '随机测验 · ' + (scope === 'all' ? '全库' : DOM_IDX[scope].name), list: list, mode: 'exam', limit: S.examCfg.count });
        break;
      }
    }
  }

  /* ---------------- 启动 ---------------- */
  function init() {
    load();
    bindEvents();
    render();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.App = { S: S, render: render, state: S };
})();
