/* 题库扩充 1/8 · d01 数据结构 + d02 组成原理与OS + d03 网络与安全 */
(function () {
  var M = {};
  (window.SE_BANK || []).forEach(function (d) { M[d.id] = d; });
  function add(id, chapters) { if (M[id]) M[id].chapters = M[id].chapters.concat(chapters); }

  add("d01", [
    {
      id: "d01c06", name: "结构选型与工程取舍", points: ["栈与队列互转", "哈希负载因子", "结构选型", "内存布局"],
      questions: [
        { id: "d01c06q1", type: "single", level: 2, tags: ["栈", "队列"],
          stem: "用两个栈实现一个队列，入队与出队的均摊时间复杂度分别是：",
          options: ["O(1)、O(1)", "O(1)、均摊 O(1)", "O(n)、O(1)", "O(n)、O(n)"],
          answer: [1],
          explain: "入队直接压入 in 栈 O(1)；出队时若 out 栈为空，把 in 栈全部倒入 out 栈再弹出，每个元素最多被搬运一次，故出队均摊 O(1)。" },
        { id: "d01c06q2", type: "single", level: 3, tags: ["哈希"],
          stem: "哈希表负载因子（元素数/桶数）过大时，最主要的影响是：",
          options: ["内存浪费", "冲突概率上升导致查找退化，需扩容 rehash", "哈希函数失效", "无法删除元素"],
          answer: [1],
          explain: "负载因子越高冲突越多，链地址法链变长、开放寻址探测变长，查找从 O(1) 退化。Java HashMap 阈值 0.75，超过即扩容为两倍并 rehash。" },
        { id: "d01c06q3", type: "multi", level: 3, tags: ["选型"],
          stem: "关于「数组 vs 链表」的工程选型，正确的有：",
          options: ["数组内存连续、缓存友好，随机访问 O(1)", "链表插入删除 O(1) 但需先定位，且指针开销大、缓存不友好", "频繁随机读取选数组，频繁中间增删选链表", "现代 CPU 上数组几乎总是更快，除非规模极大且增删集中在已知位置"],
          answer: [0, 1, 2, 3],
          explain: "四项均正确。关键洞察是「缓存局部性」常比渐进复杂度更影响实际性能，这也是为什么实践中大量场景宁可搬数据也用数组（如 ArrayList、vector）。" },
        { id: "d01c06q4", type: "single", level: 3, tags: ["内存"],
          stem: "实现一个需要频繁在两端插入删除、且要支持随机访问的结构，最佳选择通常是：",
          options: ["单链表", "双端队列（deque，分段连续数组）", "普通数组", "二叉搜索树"],
          answer: [1],
          explain: "deque 用多段连续缓冲 + 索引映射，两端操作 O(1)、随机访问 O(1)（常数略大），是 C++ std::deque、Redis list 的常见实现思路。单链表不支持随机访问。" }
      ]
    }
  ]);

  add("d02", [
    {
      id: "d02c06", name: "内核态、系统调用与中断", points: ["用户态/内核态", "系统调用开销", "中断与异常", "上下文切换成本"],
      questions: [
        { id: "d02c06q1", type: "single", level: 2, tags: ["系统调用"],
          stem: "程序发起一次系统调用（如 read）时发生的关键动作是：",
          options: ["函数调用", "通过软中断/特殊指令陷入内核态，由内核完成操作后返回用户态", "进程重启", "创建新线程"],
          answer: [1],
          explain: "系统调用通过 trap/syscall 指令从用户态切换到内核态（特权级切换 + 栈切换 + 参数校验），完成后返回。这个往返是系统调用比普通函数调用贵得多的原因（百纳秒级）。" },
        { id: "d02c06q2", type: "single", level: 3, tags: ["优化"],
          stem: "高并发网络服务中，减少系统调用次数的常用手段不包括：",
          options: ["批量读写（readv/writev）", "IO 多路复用（epoll）替代每连接一线程", "mmap 减少数据拷贝", "每次读写都加一次 fsync"],
          answer: [3],
          explain: "fsync 强制刷盘，代价极高，只会增加开销。批量 IO、多路复用、mmap/零拷贝都是减少陷入内核次数与数据拷贝的经典优化。" },
        { id: "d02c06q3", type: "judge", level: 3, tags: ["中断"],
          stem: "中断处理程序（上半部）应尽量短小，耗时工作放到下半部（如软中断、工作队列）执行。",
          options: ["正确", "错误"],
          answer: [0],
          explain: "中断处理期间通常屏蔽同级中断，过长会丢中断、增大延迟。因此内核把中断处理分为上半部（快速响应、关中断）与下半部（延后处理、可被打断）。" },
        { id: "d02c06q4", type: "multi", level: 3, tags: ["上下文切换"],
          stem: "关于上下文切换的开销来源，正确的有：",
          options: ["保存/恢复寄存器与栈指针", "切换页表导致 TLB 失效、缓存局部性被破坏", "内核调度器本身的运行开销", "切换线程一定比切换进程便宜，因为不用换页表"],
          answer: [0, 1, 2],
          explain: "线程切换确实不必换页表（同进程内），但仍需保存寄存器与栈、破坏缓存局部性，且并非「一定便宜」——跨核迁移、不同进程的线程切换仍需换页表。D 表述绝对化。" },
        { id: "d02c06q5", type: "single", level: 3, tags: ["IPC"],
          stem: "下列进程间通信方式中，吞吐量通常最高的是：",
          options: ["管道", "消息队列", "共享内存", "信号"],
          answer: [2],
          explain: "共享内存把同一块物理页映射到两个进程地址空间，读写不经过内核拷贝，是吞吐最高的 IPC；代价是需自行做同步（信号量/互斥锁）。管道与消息队列都要经过内核缓冲拷贝。" }
      ]
    },
    {
      id: "d02c07", name: "内存、并发与调优实践", points: ["多级页表", "fork/COW", "内存泄漏与OOM", "并发缺陷"],
      questions: [
        { id: "d02c07q1", type: "single", level: 3, tags: ["页表"],
          stem: "64 位系统采用多级页表的主要原因是：",
          options: ["提高访存速度", "单级页表条目过多导致页表本身占用巨大内存，多级可按需分配", "简化硬件设计", "支持更多进程"],
          answer: [1],
          explain: "64 位地址空间下若用单级页表，页表项数达 2^36 级别，页表本身就要数百 GB。多级页表让未使用的地址区间不必分配下级表，显著节省内存；代价是 TLB 未命中时需多次访存。" },
        { id: "d02c07q2", type: "single", level: 3, tags: ["fork"],
          stem: "Linux 中 fork 之后父子进程共享物理内存，直到任一方写入才复制页面，该机制称为：",
          options: ["分页", "写时复制（COW）", "交换（swap）", "内存映射"],
          answer: [1],
          explain: "COW 让 fork 变得廉价（只复制页表并置只读），真正写入时触发缺页异常再复制页面。这也是 Redis bgsave、容器快照等实现高效快照的基础。" },
        { id: "d02c07q3", type: "single", level: 3, tags: ["OOM"],
          stem: "Java 应用被 OOM Killer 杀掉，但堆内存并未打满，最可能的原因是：",
          options: ["GC 参数错误", "堆外内存（DirectByteBuffer/JNI/元空间/线程栈）泄漏导致整体 RSS 超限", "CPU 过载", "磁盘满"],
          answer: [1],
          explain: "容器/主机的 OOM 判断基于进程整体 RSS 而非仅堆。堆外内存（Netty 直接缓冲、元空间、线程栈、JNI 分配）不受 -Xmx 约束，是常见盲区。排查需看 NMT（Native Memory Tracking）与容器 RSS。" },
        { id: "d02c07q4", type: "single", level: 3, tags: ["并发缺陷"],
          stem: "「检查-然后-行动」（check-then-act）竞态条件的典型例子是：",
          options: ["两个线程同时读同一变量", "先判断 key 不存在再 put，两步之间被其他线程插入", "循环次数过多", "递归太深"],
          answer: [1],
          explain: "check-then-act 的复合操作不是原子的。解法：用原子操作（putIfAbsent/computeIfAbsent）、加锁，或数据库唯一约束兜底。同类问题还有「读-改-写」（如 i++）。" },
        { id: "d02c07q5", type: "single", level: 2, tags: ["排查"],
          stem: "线上服务 CPU 突然飙到 100%，排查的第一批命令通常是：",
          options: ["重启服务", "top -H 找到高 CPU 线程，再把线程 ID 转 16 进制到 jstack 里定位堆栈", "加大内存", "升级机器配置"],
          answer: [1],
          explain: "标准链路：top 找进程 → top -H 找线程 → printf '%x' 转十六进制 → jstack 匹配 nid → 定位到具体代码（常见死循环、正则回溯、频繁 GC）。先重启会破坏现场，不是好习惯。" }
      ]
    }
  ]);

  add("d03", [
    {
      id: "d03c05", name: "网络工程实践", points: ["NAT/DHCP", "粘包与拆包", "HTTP 缓存", "认证与会话"],
      questions: [
        { id: "d03c05q1", type: "single", level: 2, tags: ["NAT"],
          stem: "家用路由器让多台设备共用一个公网 IP 上网，依赖的核心技术是：",
          options: ["DHCP", "NAT（网络地址转换）", "DNS", "VLAN"],
          answer: [1],
          explain: "NAT 在出口把内网私有地址:端口映射为公网地址:端口，并维护映射表回程转换。DHCP 负责分配内网地址，DNS 负责域名解析，两者与地址复用是不同职责。" },
        { id: "d03c05q2", type: "single", level: 3, tags: ["TCP"],
          stem: "TCP 是字节流协议，应用层需要自行处理「粘包/拆包」，标准做法是：",
          options: ["每次发一个字节", "定长消息、分隔符或「长度前缀 + 消息体」的帧协议", "依赖 TCP 保证消息边界", "使用 UDP"],
          answer: [1],
          explain: "TCP 只保证字节流有序可靠，不保留发送方 write 的边界。应用层必须自定义帧：定长、特殊分隔符（如 \\n）、或长度字段（推荐，解析高效无歧义）。Netty 的 LengthFieldBasedFrameDecoder 即此类。" },
        { id: "d03c05q3", type: "multi", level: 3, tags: ["HTTP 缓存"],
          stem: "关于 HTTP 缓存，正确的有：",
          options: ["Cache-Control: max-age 优先级高于 Expires", "ETag/If-None-Match 用于协商缓存，命中返回 304", "no-store 表示完全不缓存", "强缓存命中时浏览器不会请求服务器"],
          answer: [0, 1, 2, 3],
          explain: "四项均正确。实践要点：HTML 用协商缓存（no-cache + ETag），带 hash 的静态资源用长 max-age + immutable，可显著降低带宽与首屏时间。" },
        { id: "d03c05q4", type: "single", level: 3, tags: ["认证"],
          stem: "相比 Session-Cookie，JWT 的主要取舍是：",
          options: ["更安全", "服务端无状态易水平扩展，但签发后难以主动失效、体积较大", "性能更差", "无法携带用户信息"],
          answer: [1],
          explain: "JWT 自包含且服务端不存会话，天然适合分布式与跨域；代价是「无法即时吊销」（需靠短过期 + 刷新令牌 + 黑名单），且每次请求都携带，体积比 Session ID 大。" },
        { id: "d03c05q5", type: "single", level: 3, tags: ["性能"],
          stem: "排查「客户端感觉慢但服务端处理很快」的问题，最该先看的指标是：",
          options: ["服务端 CPU 使用率", "各阶段耗时分解：DNS、TCP 握手、TLS 握手、TTFB、内容下载", "磁盘 IO", "代码行数"],
          answer: [1],
          explain: "端到端慢可能在网络任一环节。用浏览器 DevTools 的 Timing 面板或 curl -w 分解各阶段，才能判断是 DNS 慢、握手慢（如 TLS 未复用）、服务端 TTFB 慢还是传输慢。" }
      ]
    },
    {
      id: "d03c06", name: "攻击面与纵深防御", points: ["DDoS", "越权与IDOR", "密钥管理", "安全编码"],
      questions: [
        { id: "d03c06q1", type: "single", level: 3, tags: ["DDoS"],
          stem: "面对流量型 DDoS 攻击，最有效的第一道防线通常是：",
          options: ["增加服务器数量", "接入云厂商的高防 IP / CDN 清洗中心做流量清洗", "修改代码", "关闭网站"],
          answer: [1],
          explain: "流量型攻击会打满带宽与连接数，单靠扩容无法应对。标准做法是流量牵引到具备清洗能力的边缘节点（高防 IP/CDN），在边缘丢弃恶意流量，源站只接收干净流量。" },
        { id: "d03c06q2", type: "single", level: 3, tags: ["越权"],
          stem: "接口 GET /api/orders/{id} 只校验登录、不校验归属，导致用户 A 能查用户 B 的订单。这类漏洞称为：",
          options: ["SQL 注入", "越权访问（IDOR，不安全的直接对象引用）", "XSS", "CSRF"],
          answer: [1],
          explain: "IDOR 的本质是「只做了认证没做授权」。防御：所有资源访问都必须带上归属校验（WHERE user_id = 当前用户），或用不可枚举的 ID，并在网关/框架层做统一鉴权。" },
        { id: "d03c06q3", type: "multi", level: 3, tags: ["密钥管理"],
          stem: "关于密钥与凭证管理，正确的做法有：",
          options: ["密钥存入环境变量或专用密钥管理服务（Vault/KMS），不写进代码与仓库", "密钥泄露后立即轮换并审计影响范围", "不同环境使用不同密钥", "把密钥硬编码进前端 JS 以便调用"],
          answer: [0, 1, 2],
          explain: "前端代码对用户完全可见，硬编码等于公开泄露。第三方调用应通过自有后端代理，或使用受域名/来源限制的公开密钥（如支付公钥、地图 key 需配置白名单）。" },
        { id: "d03c06q4", type: "single", level: 2, tags: ["安全编码"],
          stem: "下列做法中最不符合安全编码原则的是：",
          options: ["对外部输入做白名单校验", "用参数化查询访问数据库", "把用户输入直接拼接进命令或 SQL", "对输出按上下文编码"],
          answer: [2],
          explain: "拼接是注入类漏洞的总根源（SQL、命令、LDAP、XPath、模板）。原则是「数据与代码分离」：参数化查询、避免 shell 拼接、必要时用白名单严格校验。" },
        { id: "d03c06q5", type: "essay", level: 3, tags: ["安全体系"],
          stem: "为一个对外提供 API 的系统设计「纵深防御」方案，说明各层防护要点。",
          answer: "①边界层：接入 WAF 与高防，做 IP 信誉、频率限制、异常 UA 与指纹拦截；只暴露必要端口，管理后台不公网可达（走 VPN/跳板）。②传输层：全站 HTTPS + HSTS，禁用弱套件与旧版本 TLS，开启证书自动续期与到期监控。③接入与认证层：OAuth2/JWT 或 Session 统一鉴权，令牌短过期 + 刷新机制；关键操作二次验证；对登录、注册、找回等接口做多维限流（账号/IP/设备）。④授权层：统一鉴权中间件，所有资源访问强制校验归属（防 IDOR）；最小权限原则，服务账号按需授权。⑤应用层：输入校验白名单、参数化查询、输出按上下文编码、CSP 防 XSS、SameSite + CSRF Token 防跨站请求、文件上传做类型与内容校验并隔离存储、反序列化禁止不可信数据。⑥数据层：敏感字段加密存储（手机号、身份证），密钥托管 KMS/Vault 并定期轮换，数据库不直接暴露公网，审计日志记录敏感操作。⑦业务与风控层：防刷、防薅羊毛、防撞库（弱口令与泄露库检测）、交易风控规则、对账与异常告警。⑧运营层：依赖漏洞扫描（SCA）、SAST/DAST 接入 CI、定期渗透测试与红蓝对抗、安全事件响应预案（含限流降级与一键封禁）。⑨组织层：安全左移（设计评审阶段引入威胁建模 STRIDE）、开发安全培训、漏洞响应 SLA。",
          explain: "评分要点：边界/传输/认证/授权/应用/数据/业务/运营/组织多层覆盖；统一鉴权与 IDOR 防护；密钥与加密存储；限流与风控；安全左移与威胁建模；应急响应预案。" }
      ]
    }
  ]);
})();
