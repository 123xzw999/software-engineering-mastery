/* 软件工程全栈知识题库 · 本科核心域 d01-d04 */
window.SE_BANK = window.SE_BANK || [];
window.SE_BANK.push(
{
  id: "d01",
  name: "程序设计基础与数据结构",
  tier: "core",
  icon: "DS",
  short: "数据结构与算法基石",
  summary: "一切工程能力的底座。面试第一关、性能优化第一现场。掌握抽象数据类型、复杂度思维与经典结构的适用边界。",
  hours: 120,
  chapters: [
    {
      id: "d01c01", name: "复杂度分析与算法基础", points: ["渐进记号", "最好/最坏/平均/均摊", "空间复杂度", "递归式求解"],
      questions: [
        { id: "d01c01q1", type: "single", level: 1, tags: ["复杂度"],
          stem: "关于大 O 记号 O(f(n)) 的含义，下列说法正确的是：",
          options: ["算法在任何输入下的精确运行步数", "存在常数 c 与 n0，使 n≥n0 时 T(n) ≤ c·f(n)", "算法运行时间的下界", "算法在最好情况下的运行时间"],
          answer: [1],
          explain: "O 是渐进上界：存在正常数 c、n0，当 n≥n0 时 T(n) ≤ c·f(n)。Ω 才是下界，Θ 是紧确界。O 描述的是增长量级，与具体常数、机器无关。" },
        { id: "d01c01q2", type: "single", level: 2, tags: ["均摊分析"],
          stem: "动态数组（vector）尾部插入元素，单次最坏 O(n)（扩容复制），但 n 次连续插入的总代价为：",
          options: ["O(n log n)", "O(n²)", "O(n)", "O(1)"],
          answer: [2],
          explain: "容量按倍数（如 2 倍）增长时，扩容总代价为 1+2+4+…+n < 2n，均摊到每次插入是 O(1)，n 次总代价 O(n)。这正是「均摊分析」的经典例子。" },
        { id: "d01c01q3", type: "judge", level: 1, tags: ["复杂度"],
          stem: "若算法 A 的时间复杂度为 O(n)，算法 B 为 O(n²)，则在小规模输入下 A 的运行时间一定短于 B。",
          options: ["正确", "错误"],
          answer: [1],
          explain: "渐进复杂度描述的是 n 充分大时的增长趋势。小规模输入下常数因子、低阶项占主导，O(n²) 的算法完全可能更快（例如插入排序 vs 快排小数组）。" },
        { id: "d01c01q4", type: "multi", level: 3, tags: ["递归式", "主定理"],
          stem: "关于递归式 T(n)=2T(n/2)+Θ(n) 的求解，下列说法正确的有：",
          options: ["由主定理情况 2 得 T(n)=Θ(n log n)", "它对应归并排序的时间复杂度", "T(n)=Θ(n²)", "主定理要求形如 T(n)=aT(n/b)+f(n) 且 a≥1, b>1"],
          answer: [0, 1, 3],
          explain: "a=2,b=2,log_b a=1，f(n)=Θ(n^1)，属于主定理情况 2，T(n)=Θ(n log n)，与归并排序一致。C 错误。" }
      ]
    },
    {
      id: "d01c02", name: "线性结构", points: ["数组/链表", "栈与队列", "双端队列", "字符串匹配"],
      questions: [
        { id: "d01c02q1", type: "single", level: 2, tags: ["链表"],
          stem: "已知单链表头指针 head，要在 O(1) 时间内删除某个给定结点 p（p 非尾结点），正确做法是：",
          options: ["遍历找 p 的前驱再删除", "把 p->next 的值复制到 p，然后删除 p->next", "直接 free(p)", "把 p 指向自己"],
          answer: [1],
          explain: "单链表无法 O(1) 找到前驱，因此用「偷梁换柱」：复制后继数据到当前结点，再删后继。这是 O(1) 删除已知非尾结点的标准技巧。" },
        { id: "d01c02q2", type: "single", level: 1, tags: ["栈"],
          stem: "表达式求值、括号匹配、函数调用栈共同依赖的数据结构是：",
          options: ["队列", "栈", "堆", "并查集"],
          answer: [1],
          explain: "三者都满足「后进先出」语义：最近开始的调用最先返回，最近的左括号最先匹配。" },
        { id: "d01c02q3", type: "single", level: 2, tags: ["队列"],
          stem: "用大小为 n 的循环数组实现队列，判断「队满」而不牺牲一个存储单元，最常用的做法是：",
          options: ["front==rear 即满", "增加 size 计数或使用 tag 标记", "队列不能满", "把 rear 指向 -1"],
          answer: [1],
          explain: "front==rear 既可能是空也可能是满。解决办法：①牺牲一个空位；②维护 size 变量；③使用 tag 标记最近一次是入队还是出队。" },
        { id: "d01c02q4", type: "multi", level: 3, tags: ["字符串", "KMP"],
          stem: "关于 KMP 算法，下列说法正确的有：",
          options: ["利用模式串自身的 next（部分匹配）数组避免主串指针回退", "时间复杂度 O(n+m)", "next 数组的求解基于模式串的最长相等前后缀", "最坏情况下比朴素匹配更慢"],
          answer: [0, 1, 2],
          explain: "KMP 主串指针 i 永不回退，模式串指针 j 依据 next 数组滑动，整体 O(n+m)，最坏情况也优于朴素算法的 O(nm)。" }
      ]
    },
    {
      id: "d01c03", name: "树与堆", points: ["二叉树遍历", "BST/AVL/红黑树", "堆与优先队列", "B 树/B+ 树"],
      questions: [
        { id: "d01c03q1", type: "single", level: 1, tags: ["遍历"],
          stem: "对二叉搜索树进行下列哪种遍历可以得到关键字递增序列？",
          options: ["前序", "中序", "后序", "层序"],
          answer: [1],
          explain: "BST 的中序遍历（左-根-右）恰好按关键字升序输出，这是 BST 最基本的性质之一。" },
        { id: "d01c03q2", type: "single", level: 2, tags: ["堆"],
          stem: "在含 n 个元素的大顶堆中，插入一个元素并调整的时间复杂度是：",
          options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
          answer: [1],
          explain: "插入后沿树高向上「上浮」，树高为 ⌊log n⌋，故 O(log n)。而自底向上建堆（Floyd 算法）总代价是 O(n)。" },
        { id: "d01c03q3", type: "single", level: 3, tags: ["平衡树"],
          stem: "红黑树相较于 AVL 树的主要工程优势是：",
          options: ["查找更快", "插入/删除时的旋转次数更少，写多读多场景下更稳定", "占用空间更小", "支持范围查询"],
          answer: [1],
          explain: "红黑树只保证「近似平衡」（最长路径 ≤ 2×最短路径），换取了插入删除时更少的旋转与更好的摊还性能，因此被 Java TreeMap、C++ std::map、Linux CFS 等广泛采用。" },
        { id: "d01c03q4", type: "multi", level: 3, tags: ["B+树", "索引"],
          stem: "数据库索引普遍采用 B+ 树而非二叉树，原因包括：",
          options: ["B+ 树高度低，磁盘 I/O 次数少", "叶结点串成链表，便于范围扫描", "所有数据都在叶结点，查询路径长度稳定", "B+ 树插入比二叉树快"],
          answer: [0, 1, 2],
          explain: "磁盘按页读取，B+ 树一个结点可容纳数百个键，三到四层即可索引上亿数据；叶子链表天然支持区间查询与顺序扫描，查询路径长度一致，便于估算代价。" }
      ]
    },
    {
      id: "d01c04", name: "图", points: ["表示方法", "DFS/BFS", "最短路", "最小生成树", "拓扑排序"],
      questions: [
        { id: "d01c04q1", type: "single", level: 2, tags: ["最短路"],
          stem: "含有负权边但不存在负权回路的单源最短路问题，应使用：",
          options: ["Dijkstra", "Bellman-Ford", "Floyd", "Prim"],
          answer: [1],
          explain: "Dijkstra 的贪心前提是边权非负；Bellman-Ford 通过 n-1 轮松弛可处理负权边，并能检测负权回路，复杂度 O(VE)。" },
        { id: "d01c04q2", type: "single", level: 2, tags: ["拓扑排序"],
          stem: "对工程依赖图做拓扑排序，若排序过程结束后仍有结点未输出，说明：",
          options: ["图不连通", "图中存在环", "图是二分图", "排序算法有误"],
          answer: [1],
          explain: "拓扑排序存在当且仅当有向图无环（DAG）。若入度归零的结点数少于总结点数，则剩余部分必然含环——这也是构建系统循环依赖检测的原理。" },
        { id: "d01c04q3", type: "multi", level: 3, tags: ["并查集", "MST"],
          stem: "关于并查集（Union-Find）与 Kruskal 算法，正确的有：",
          options: ["路径压缩可将 find 均摊复杂度降到近似 O(α(n))", "Kruskal 按边权排序后贪心选边，用并查集判环", "按秩合并可避免树退化成链", "Kruskal 与 Prim 都只能求有向图的最小生成树"],
          answer: [0, 1, 2],
          explain: "路径压缩 + 按秩合并使均摊复杂度为反阿克曼函数 α(n)，实际近似常数。Kruskal 依赖并查集判环；Prim 依赖优先队列。MST 只对无向连通图定义，D 错误。" },
        { id: "d01c04q4", type: "essay", level: 3, tags: ["综合"],
          stem: "简述如何判断一个有向图是否存在环，并说明两种以上方法及其复杂度。",
          answer: "方法一：DFS 染色法（白/灰/黑）。遍历时若遇到「灰」结点（仍在当前递归栈中）则存在环；时间 O(V+E)，空间 O(V)。方法二：拓扑排序（Kahn 算法）。统计入度，反复取出入度为 0 的结点并删边，若最终输出结点数 < V 则存在环；时间 O(V+E)。方法三：对每个点做 DFS 并维护访问栈，或用 Tarjan/Floyd 判环。工程上最常用的是 Kahn 拓扑排序，因为它还能顺带给出构建顺序（如包管理器、CI 流水线依赖检测）。",
          explain: "评分要点：①DFS 染色/递归栈法并说明灰结点含义；②Kahn 拓扑排序法并说明入度为 0 的处理；③复杂度 O(V+E)；④给出工程场景（依赖检测、死锁检测）。" }
      ]
    },
    {
      id: "d01c05", name: "散列、排序与高级结构", points: ["哈希表与冲突", "排序算法对比", "跳表", "Trie"],
      questions: [
        { id: "d01c05q1", type: "single", level: 2, tags: ["哈希"],
          stem: "开放寻址法解决哈希冲突时，删除元素不能直接置空的原因是：",
          options: ["会浪费空间", "会截断探测链，导致后续元素查找失败", "会破坏哈希函数", "会引发内存泄漏"],
          answer: [1],
          explain: "开放寻址把探测序列当作一条链，直接置空会让「墓碑」后的元素无法被找到。正确做法是设置删除标记（tombstone），或在必要时重建哈希表。" },
        { id: "d01c05q2", type: "single", level: 2, tags: ["排序"],
          stem: "下列排序算法中，时间复杂度与初始序列是否有序无关、且不稳定的是：",
          options: ["插入排序", "归并排序", "快速排序", "堆排序"],
          answer: [3],
          explain: "堆排序任何输入下都是 O(n log n)，但交换会打乱相等元素的相对次序，是不稳定排序。快排最坏 O(n²)；插入排序接近 O(n)；归并稳定且始终 O(n log n)。" },
        { id: "d01c05q3", type: "single", level: 3, tags: ["跳表"],
          stem: "Redis 有序集合（ZSet）底层采用跳表而非红黑树，主要原因是：",
          options: ["跳表空间更省", "跳表实现简单，且天然支持范围查询与并发友好", "跳表查找更快", "红黑树不支持排序"],
          answer: [1],
          explain: "跳表代码复杂度低、范围查询（ZRANGE）只需沿层遍历，且易于实现无锁/细粒度并发。红黑树在范围查询上需要中序后继回溯，实现更繁琐。" },
        { id: "d01c05q4", type: "judge", level: 2, tags: ["Trie"],
          stem: "Trie（前缀树）在存储大量短字符串时，空间开销通常优于哈希表。",
          options: ["正确", "错误"],
          answer: [1],
          explain: "Trie 每个字符都可能新开结点，指针开销大，空间通常劣于哈希表。Trie 的优势在于前缀查询、自动补全、最长前缀匹配等哈希表难以高效支持的场景。" }
      ]
    }
  ]
},
{
  id: "d02",
  name: "计算机组成原理与操作系统",
  tier: "core",
  icon: "OS",
  short: "机器与系统底层",
  summary: "理解程序从源码到指令、从指令到硬件、从进程到 CPU 的全过程。性能调优、并发 bug、内存泄漏的根源都在这里。",
  hours: 140,
  chapters: [
    {
      id: "d02c01", name: "数据表示与指令系统", points: ["补码与浮点", "IEEE 754", "指令流水线", "CISC/RISC"],
      questions: [
        { id: "d02c01q1", type: "single", level: 2, tags: ["浮点"],
          stem: "IEEE 754 单精度浮点数中，0.1 无法精确表示的根本原因是：",
          options: ["位数不够", "0.1 的二进制是无限循环小数", "符号位占用了一位", "硬件不支持小数"],
          answer: [1],
          explain: "0.1 = 0.0001100110011…（二进制无限循环），尾数位数有限必然截断。这是 0.1+0.2!=0.3 的根源，金融计算必须用整数或 BigDecimal。" },
        { id: "d02c01q2", type: "single", level: 2, tags: ["补码"],
          stem: "8 位补码能表示的有符号整数范围是：",
          options: ["-127 ~ 127", "-128 ~ 127", "0 ~ 255", "-127 ~ 128"],
          answer: [1],
          explain: "n 位补码范围是 -2^(n-1) ~ 2^(n-1)-1，8 位即 -128 ~ 127。补码使加减法统一为加法，且只有一个零。" },
        { id: "d02c01q3", type: "judge", level: 2, tags: ["流水线"],
          stem: "指令流水线能降低单条指令的延迟（latency）。",
          options: ["正确", "错误"],
          answer: [1],
          explain: "流水线提高的是吞吐率（throughput），单条指令的执行延迟基本不变甚至略增（因流水线寄存器开销）。它通过重叠执行多条指令提升单位时间完成量。" }
      ]
    },
    {
      id: "d02c02", name: "存储层次与缓存", points: ["局部性原理", "缓存映射", "写策略", "MESI 一致性"],
      questions: [
        { id: "d02c02q1", type: "single", level: 2, tags: ["局部性"],
          stem: "按行优先遍历二维数组比按列优先快，主要体现的是：",
          options: ["时间局部性", "空间局部性", "指令级并行", "分支预测"],
          answer: [1],
          explain: "数组按行连续存储，行优先遍历访问的是连续地址，命中同一缓存行，体现空间局部性。列优先会不断跨行跳跃，造成大量缓存缺失。" },
        { id: "d02c02q2", type: "single", level: 3, tags: ["伪共享"],
          stem: "多线程程序中出现「伪共享（false sharing）」导致性能骤降，原因是：",
          options: ["两个线程读同一变量", "两个线程修改位于同一缓存行的不同变量，引发缓存行反复失效", "缓存容量不足", "发生了死锁"],
          answer: [1],
          explain: "缓存一致性以「缓存行」为粒度。即使两个线程写的是不同变量，只要同处一行就会互相使对方缓存失效、来回同步。解法是填充对齐（padding）或线程本地变量。" },
        { id: "d02c02q3", type: "multi", level: 3, tags: ["一致性协议"],
          stem: "关于 MESI 缓存一致性协议，正确的有：",
          options: ["M 表示已修改，数据与主存不一致", "E 表示独占，与主存一致", "S 表示共享，多核可同时持有只读副本", "I 表示无效"],
          answer: [0, 1, 2, 3],
          explain: "MESI 四态：Modified（脏、独占）、Exclusive（干净、独占）、Shared（干净、共享）、Invalid（无效）。它是现代多核 CPU 维护缓存一致性的基础协议。" }
      ]
    },
    {
      id: "d02c03", name: "进程、线程与并发", points: ["进程vs线程", "上下文切换", "同步互斥", "死锁", "协程"],
      questions: [
        { id: "d02c03q1", type: "single", level: 1, tags: ["进程线程"],
          stem: "同一进程内的多个线程共享下列哪项资源？",
          options: ["栈", "寄存器", "地址空间与打开的文件描述符", "程序计数器"],
          answer: [2],
          explain: "线程共享进程的地址空间、全局变量、文件描述符、信号处理等；各自私有栈、寄存器上下文、PC、线程局部存储。" },
        { id: "d02c03q2", type: "single", level: 2, tags: ["死锁"],
          stem: "死锁的四个必要条件不包括：",
          options: ["互斥", "请求并保持", "不可剥夺", "优先级反转"],
          answer: [3],
          explain: "死锁四条件：互斥、请求并保持、不可剥夺、循环等待。优先级反转是调度问题，不是死锁条件（但可加剧死锁风险）。破坏任一条件即可预防死锁。" },
        { id: "d02c03q3", type: "single", level: 3, tags: ["同步"],
          stem: "下列关于「条件变量」的使用，正确的是：",
          options: ["等待时应使用 if 判断条件", "等待时应使用 while 循环重新检查条件", "条件变量无需配合互斥锁", "signal 后条件一定满足"],
          answer: [1],
          explain: "被唤醒后条件可能已被其他线程改变（惊群、虚假唤醒），必须用 while 重新检查谓词。标准写法：加锁 → while(!cond) wait → 处理 → 解锁。" },
        { id: "d02c03q4", type: "essay", level: 3, tags: ["并发模型"],
          stem: "对比线程、协程与异步回调三种并发模型，说明各自适用场景与代价。",
          answer: "线程：内核调度，可真正并行，编程模型直观，但创建/切换成本高（微秒级、需陷入内核），数量受限（数千级），共享内存需加锁，易出错。协程：用户态调度，切换成本极低（纳秒级、无内核陷入），单线程内可开十万级，适合 IO 密集型与高并发服务（Go goroutine、Kotlin coroutine）；代价是需要运行时调度器支持，且 CPU 密集任务仍需多线程配合，阻塞式系统调用会卡住调度线程。异步回调：事件驱动、无线程切换开销，适合高并发网络 IO（Node.js、Netty）；代价是回调地狱、错误传播与调试困难，需靠 Promise/Future、async-await 语法糖改善。工程结论：IO 密集高并发首选协程/异步；CPU 密集用线程池或并行流；混合场景采用「协程 + 线程池」分层。",
          explain: "评分要点：①三者的调度层级（内核/用户/事件循环）；②切换与内存代价量级；③典型适用场景与代表技术；④共享状态与错误处理复杂度对比；⑤给出选型结论。" }
      ]
    },
    {
      id: "d02c04", name: "调度与内存管理", points: ["调度算法", "虚拟内存", "分页与TLB", "缺页与置换"],
      questions: [
        { id: "d02c04q1", type: "single", level: 2, tags: ["虚拟内存"],
          stem: "虚拟内存机制带来的好处不包括：",
          options: ["进程地址空间隔离", "可用空间超过物理内存", "内存访问延迟降低", "便于共享库与写时复制"],
          answer: [2],
          explain: "虚拟内存通过页表映射引入额外开销（TLB 未命中需多次访存），并不降低单次访存延迟。它带来的是隔离性、超额分配、共享与 COW。" },
        { id: "d02c04q2", type: "single", level: 2, tags: ["页面置换"],
          stem: "在页面置换算法中，可能出现 Belady 异常的是：",
          options: ["LRU", "FIFO", "OPT", "Clock"],
          answer: [1],
          explain: "FIFO 存在 Belady 异常：分配的物理页框增多，缺页次数反而上升。LRU 与 OPT 属于栈式算法，不会出现该异常。" },
        { id: "d02c04q3", type: "multi", level: 3, tags: ["TLB"],
          stem: "关于 TLB（快表），正确的有：",
          options: ["缓存的是页表项（虚拟页号→物理页框号）", "TLB 未命中时通常由硬件或内核遍历页表填充", "进程切换时通常需要刷新 TLB 或使用 ASID 区分", "TLB 容量比 L1 缓存大"],
          answer: [0, 1, 2],
          explain: "TLB 是页表项的专用高速缓存，容量很小（几十到几千项），因此 D 错误。进程切换会更换页表基址，需刷新 TLB 或用 ASID 标签避免全局刷新。" }
      ]
    },
    {
      id: "d02c05", name: "文件系统与 I/O", points: ["inode", "IO 模型", "零拷贝", "页缓存"],
      questions: [
        { id: "d02c05q1", type: "single", level: 2, tags: ["inode"],
          stem: "在类 Unix 文件系统中，硬链接与符号链接的关键区别是：",
          options: ["硬链接可以跨文件系统", "硬链接与原文件共享同一 inode，删除原文件不影响访问", "符号链接不计入引用计数", "硬链接可指向目录"],
          answer: [1],
          explain: "硬链接是同一 inode 的多个目录项，引用计数 +1，删原文件仍可访问；符号链接是独立 inode 存路径字符串，原文件删除即失效。硬链接不能跨文件系统、一般不能指向目录。" },
        { id: "d02c05q2", type: "single", level: 3, tags: ["IO 模型"],
          stem: "Linux 的 epoll 相比 select/poll 的核心优势是：",
          options: ["支持更多事件类型", "就绪事件由内核维护并返回，无需遍历全部 fd", "无需系统调用", "支持阻塞 IO"],
          answer: [1],
          explain: "select/poll 每次调用都要把全部 fd 集合拷入内核并线性扫描，复杂度 O(n)；epoll 用红黑树注册 + 就绪链表回调，只返回就绪的 fd，复杂度 O(1)（与活跃数相关），适合万级连接。" },
        { id: "d02c05q3", type: "single", level: 3, tags: ["零拷贝"],
          stem: "Kafka 高性能读写大量依赖「零拷贝」，其典型实现是：",
          options: ["mmap + 多线程", "sendfile / DMA 直接在内核缓冲与网卡间传输，减少 CPU 拷贝与上下文切换", "压缩算法", "SSD 硬件加速"],
          answer: [1],
          explain: "传统 write 需经历 用户缓冲→内核缓冲→socket 缓冲 四次拷贝与多次上下文切换。sendfile/零拷贝让数据通过 DMA 在内核页缓存与网卡间直接传输，把拷贝降到 0~1 次，Kafka 的消费者读取正是靠它支撑高吞吐。" }
      ]
    }
  ]
},
{
  id: "d03",
  name: "计算机网络与信息安全",
  tier: "core",
  icon: "NET",
  short: "从协议到攻防",
  summary: "后端工程师的必备常识：一次请求穿过几层、为什么慢、为什么丢包、如何被攻击以及如何防。",
  hours: 110,
  chapters: [
    {
      id: "d03c01", name: "分层模型与链路层", points: ["OSI/TCP-IP", "封装解封装", "以太网与ARP", "MTU"],
      questions: [
        { id: "d03c01q1", type: "single", level: 1, tags: ["分层"],
          stem: "TCP/IP 四层模型中，IP 协议位于：",
          options: ["应用层", "传输层", "网络层", "网络接口层"],
          answer: [2],
          explain: "TCP/IP 四层：应用层（HTTP/DNS）、传输层（TCP/UDP）、网络层（IP/ICMP/路由）、网络接口层。IP 负责主机到主机的寻址与转发。" },
        { id: "d03c01q2", type: "single", level: 2, tags: ["ARP"],
          stem: "同一局域网内主机 A 要与主机 B 通信，需要先通过 ARP 获取：",
          options: ["B 的 IP 地址", "B 的 MAC 地址", "网关的域名", "B 的端口号"],
          answer: [1],
          explain: "IP 决定路径，MAC 决定同一链路上的下一跳。ARP 负责在局域网内把 IP 解析为 MAC。若目的不在本网段，则解析的是默认网关的 MAC。" },
        { id: "d03c01q3", type: "single", level: 3, tags: ["MTU"],
          stem: "传输路径上某段链路 MTU 变小，导致大包被丢弃，IPv4 中的典型处理是：",
          options: ["重新握手", "路由器发 ICMP 需分片消息，源端调整 MSS/DF 后重传", "自动降速", "改用 UDP"],
          answer: [1],
          explain: "这是 PMTUD（路径 MTU 发现）问题：设置 DF 位的大包被丢弃后，路由器返回 ICMP Fragmentation Needed，源端据此减小报文。若 ICMP 被防火墙阻断会出现「小请求正常、大请求卡死」的经典故障。" }
      ]
    },
    {
      id: "d03c02", name: "IP、路由与 TCP", points: ["子网划分", "TCP 三次握手四次挥手", "拥塞控制", "TIME_WAIT"],
      questions: [
        { id: "d03c02q1", type: "single", level: 2, tags: ["子网"],
          stem: "CIDR 表示 192.168.1.0/26 中可分配给主机的地址个数是：",
          options: ["64", "62", "32", "30"],
          answer: [1],
          explain: "主机位 = 32-26 = 6 位，共 2^6=64 个地址，扣除网络地址与广播地址，可用 62 个。" },
        { id: "d03c02q2", type: "multi", level: 2, tags: ["握手"],
          stem: "关于 TCP 三次握手，正确的有：",
          options: ["第三次握手可以携带数据", "两次握手无法防止历史连接请求造成资源浪费", "SYN 会消耗序号", "四次挥手是因为 TCP 连接是全双工的"],
          answer: [0, 1, 2, 3],
          explain: "四项均正确。三次握手确认双向收发能力并丢弃过期 SYN；SYN 占一个序号；因为双向需各自关闭，故挥手通常四次。" },
        { id: "d03c02q3", type: "single", level: 3, tags: ["TIME_WAIT"],
          stem: "主动关闭方进入 TIME_WAIT 并等待 2MSL 的主要目的不包括：",
          options: ["确保最后的 ACK 能到达对方", "让本次连接的迟到报文在网络中消亡", "防止端口被立即复用导致新旧连接数据混淆", "释放内核内存"],
          answer: [3],
          explain: "TIME_WAIT 期间内核资源仍被占用，并非为了释放内存。高并发短连接服务常因大量 TIME_WAIT 耗尽端口，解法是使用连接池/长连接、开启 tcp_tw_reuse。" },
        { id: "d03c02q4", type: "single", level: 3, tags: ["拥塞控制"],
          stem: "TCP 拥塞控制中，「慢启动」阶段的拥塞窗口增长方式是：",
          options: ["线性增长", "指数增长", "保持不变", "随机变化"],
          answer: [1],
          explain: "慢启动阶段每收到一个 ACK 窗口加 1，等效每个 RTT 翻倍（指数增长），到达 ssthresh 后转为拥塞避免的线性增长（每 RTT 加 1）。" },
        { id: "d03c02q5", type: "judge", level: 2, tags: ["UDP"],
          stem: "UDP 因为不可靠，所以在生产环境中不适合传输实时音视频。",
          options: ["正确", "错误"],
          answer: [1],
          explain: "恰恰相反：实时音视频更偏好 UDP，因为丢弃过期帧比等待重传更有价值。现代方案（QUIC、WebRTC）在 UDP 之上自建可靠性与拥塞控制，避免 TCP 队头阻塞。" }
      ]
    },
    {
      id: "d03c03", name: "应用层协议", points: ["HTTP/1.1→3", "HTTPS 与 TLS", "DNS", "CDN"],
      questions: [
        { id: "d03c03q1", type: "single", level: 2, tags: ["HTTP"],
          stem: "HTTP/1.1 的「队头阻塞」问题在 HTTP/2 中的缓解方式是：",
          options: ["多路复用：同一 TCP 连接上并发传输多个流", "增加连接数", "改用 UDP", "压缩头部"],
          answer: [0],
          explain: "HTTP/2 引入二进制分帧与流，多个请求可在同一连接交错传输，解决了 HTTP 层的队头阻塞；但 TCP 层队头阻塞仍在，最终由 HTTP/3（基于 QUIC/UDP）解决。" },
        { id: "d03c03q2", type: "multi", level: 2, tags: ["HTTPS"],
          stem: "关于 HTTPS 与 TLS 握手，正确的有：",
          options: ["对称加密用于传输数据，非对称加密用于协商密钥", "证书用于验证服务端身份，防止中间人攻击", "TLS 1.3 将握手往返压缩到 1-RTT，并支持 0-RTT 恢复", "HTTPS 能防止所有类型的攻击，包括 XSS"],
          answer: [0, 1, 2],
          explain: "HTTPS 只保证传输层机密性与身份认证，不能防 XSS/CSRF 等应用层攻击。D 错误。" },
        { id: "d03c03q3", type: "single", level: 3, tags: ["DNS"],
          stem: "用户在浏览器输入域名后，通常最先查询的 DNS 是：",
          options: ["根域名服务器", "本地 hosts 与本地 DNS 缓存/递归解析器", "顶级域服务器", "权威域名服务器"],
          answer: [1],
          explain: "解析顺序：浏览器缓存 → 系统 hosts → 本地 DNS 缓存 → 递归解析器（再依次问根、顶级域、权威服务器）。DNS 常用于负载均衡与故障切换（如按地域返回不同 IP）。" },
        { id: "d03c03q4", type: "single", level: 2, tags: ["CDN"],
          stem: "CDN 加速静态资源的原理是：",
          options: ["压缩资源体积", "将内容缓存到离用户更近的边缘节点，缩短网络路径", "加密传输", "提高服务器 CPU 性能"],
          answer: [1],
          explain: "CDN 通过 DNS 调度把用户导向地理/网络最近的边缘节点，命中缓存则直接返回，降低时延与回源压力；同时支持预热、刷新、回源鉴权等能力。" }
      ]
    },
    {
      id: "d03c04", name: "网络安全基础", points: ["OWASP Top 10", "SQL注入/XSS/CSRF", "认证与会话", "密码学基础"],
      questions: [
        { id: "d03c04q1", type: "single", level: 2, tags: ["注入"],
          stem: "防御 SQL 注入最根本有效的措施是：",
          options: ["过滤单引号", "使用参数化查询（预编译语句）", "隐藏报错信息", "限制返回行数"],
          answer: [1],
          explain: "参数化查询让 SQL 结构与数据彻底分离，数据永远不被当作代码解析，从根本上杜绝注入。字符过滤只能缓解，易被绕过。" },
        { id: "d03c04q2", type: "single", level: 3, tags: ["CSRF"],
          stem: "防御 CSRF 攻击的常用手段不包括：",
          options: ["校验 SameSite Cookie 属性", "使用一次性 CSRF Token", "校验 Referer/Origin", "对密码进行加盐哈希"],
          answer: [3],
          explain: "密码加盐哈希防的是「撞库与彩虹表」，与 CSRF 无关。CSRF 的本质是「借用户浏览器携带的凭证发请求」，因此要用 Token、SameSite、来源校验，以及对关键操作二次验证。" },
        { id: "d03c04q3", type: "multi", level: 2, tags: ["XSS"],
          stem: "关于 XSS 与防护，正确的有：",
          options: ["存储型 XSS 危害最大，因所有访问者都会中招", "输出编码需根据上下文（HTML/属性/JS/URL）选择", "CSP 内容安全策略可限制脚本来源", "把用户输入存进数据库前转义即可彻底防御"],
          answer: [0, 1, 2],
          explain: "「存储时转义」是常见误区：数据可能有多个输出上下文，且可能被其他系统消费。正确做法是「输入校验 + 输出按上下文编码 + CSP + HttpOnly Cookie」多层防御。" },
        { id: "d03c04q4", type: "essay", level: 3, tags: ["综合", "安全设计"],
          stem: "设计一个用户登录系统，从安全角度说明你会考虑哪些要点。",
          answer: "1) 传输安全：全站 HTTPS + HSTS，禁止明文口令。2) 口令存储：使用 bcrypt/scrypt/Argon2 等慢哈希并加随机盐，禁止 MD5/SHA1 裸哈希；可加服务端 pepper。3) 暴力破解防护：失败计数 + 指数退避锁定 + 图形/短信验证码 + IP 与账号双维度限流。4) 会话管理：登录后签发随机 Session ID 或 JWT，Cookie 设置 HttpOnly、Secure、SameSite=Lax/Strict；提供会话失效与「全端下线」。5) 防重放与 CSRF：一次性 Token 或双提交 Cookie。6) 账号枚举防护：登录失败提示统一为「账号或密码错误」，注册/找回接口做响应时间与提示一致性处理。7) 风控与审计：异地/新设备登录二次验证，记录登录日志与异常告警。8) 密码策略：长度优先于复杂度，检测弱口令与已泄露口令库。9) 单点登录场景用 OAuth2/OIDC，不要把令牌放在 URL。10) 定期做安全测试：越权、注入、JWT 算法混淆（none 攻击）等。",
          explain: "评分要点：口令哈希算法选择与加盐、传输加密、限流与锁定、会话与 Cookie 属性、CSRF 与重放、账号枚举、风控与审计、SSO 令牌安全、越权测试。" }
      ]
    }
  ]
},
{
  id: "d04",
  name: "数据库系统原理",
  tier: "core",
  icon: "DB",
  short: "数据持久化与一致性",
  summary: "后端最核心的工程能力之一。从关系代数到索引优化、从事务隔离到分布式一致性，决定系统的正确性与性能上限。",
  hours: 130,
  chapters: [
    {
      id: "d04c01", name: "关系模型与 SQL", points: ["关系代数", "连接类型", "聚合与窗口函数", "执行计划"],
      questions: [
        { id: "d04c01q1", type: "single", level: 2, tags: ["连接"],
          stem: "下列连接中，会保留左表全部行、右表无匹配时补 NULL 的是：",
          options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SEMI JOIN"],
          answer: [1],
          explain: "LEFT JOIN 保留左表全集。工程陷阱：把右表过滤条件写在 ON 还是 WHERE 结果不同——写在 WHERE 会把补 NULL 的行过滤掉，退化为内连接。" },
        { id: "d04c01q2", type: "single", level: 3, tags: ["执行计划"],
          stem: "EXPLAIN 输出中 type=ALL 表示：",
          options: ["使用了索引", "全表扫描", "使用了覆盖索引", "使用了临时表"],
          answer: [1],
          explain: "MySQL 中 type 从好到差大致为 system > const > eq_ref > ref > range > index > ALL。ALL 是全表扫描，大表上需重点优化（加索引、改写条件、避免函数作用于索引列）。" },
        { id: "d04c01q3", type: "single", level: 3, tags: ["窗口函数"],
          stem: "要查询每个部门薪资排名前 3 的员工，最合适的 SQL 写法是：",
          options: ["GROUP BY 部门 + MAX", "窗口函数 ROW_NUMBER() OVER(PARTITION BY 部门 ORDER BY 薪资 DESC) 后筛 rn<=3", "多次子查询取最大值", "DISTINCT + LIMIT 3"],
          answer: [1],
          explain: "窗口函数可在不折叠行的前提下分区排序并编号，配合外层筛选即可实现 Top-N per group，是分组取前 N 的标准解法。" }
      ]
    },
    {
      id: "d04c02", name: "范式与数据库设计", points: ["1NF/2NF/3NF/BCNF", "反范式", "ER 建模", "分库分表"],
      questions: [
        { id: "d04c02q1", type: "single", level: 2, tags: ["范式"],
          stem: "消除非主属性对码的传递函数依赖，达到的是：",
          options: ["1NF", "2NF", "3NF", "BCNF"],
          answer: [2],
          explain: "1NF 属性原子；2NF 消除非主属性对码的部分依赖；3NF 消除传递依赖；BCNF 要求每个决定因素都包含码。" },
        { id: "d04c02q2", type: "single", level: 3, tags: ["分库分表"],
          stem: "对订单表按 user_id 哈希分 16 库，带来的最主要问题是：",
          options: ["无法按订单号查询", "非分片键的查询需广播到所有分片（跨片查询）", "数据量变少", "不能加索引"],
          answer: [1],
          explain: "分片键决定路由。按 user_id 分片后，按订单号/时间/状态查询无法定位分片，需要广播聚合或建立异构索引表（基因法、映射表）。这是分库分表的核心权衡。" },
        { id: "d04c02q3", type: "judge", level: 3, tags: ["反范式"],
          stem: "在互联网高并发系统中，为提升读性能适当冗余字段（反范式）是合理的工程选择。",
          options: ["正确", "错误"],
          answer: [0],
          explain: "范式服务于一致性，反范式服务于性能。读多写少、允许最终一致的场景（如商品列表冗余店铺名）可接受冗余，但必须明确更新策略与补偿机制。" }
      ]
    },
    {
      id: "d04c03", name: "索引、存储与优化", points: ["B+树索引", "聚簇/二级索引", "最左前缀", "回表与覆盖索引", "锁与慢查询"],
      questions: [
        { id: "d04c03q1", type: "single", level: 3, tags: ["索引"],
          stem: "联合索引 (a, b, c) 上，下列哪个查询无法有效利用索引？",
          options: ["WHERE a=1 AND b=2", "WHERE a=1 AND b>2 AND c=3", "WHERE b=2 AND c=3", "WHERE a=1 ORDER BY b"],
          answer: [2],
          explain: "最左前缀原则：跳过 a 直接查 b、c 无法走索引。另外范围条件（b>2）之后的列（c）只能用于过滤而不能用于定位（MySQL 5.6+ 可用索引下推优化部分场景）。" },
        { id: "d04c03q2", type: "single", level: 3, tags: ["覆盖索引"],
          stem: "「回表」指的是：",
          options: ["删除数据", "二级索引查到主键后，再回聚簇索引取完整行", "表结构变更", "事务回滚"],
          answer: [1],
          explain: "InnoDB 二级索引叶结点只存索引列 + 主键。若查询列不全在索引中，需用主键回到聚簇索引再查一次，即回表。把查询列全部放进索引即为覆盖索引，可避免回表。" },
        { id: "d04c03q3", type: "single", level: 3, tags: ["锁"],
          stem: "MySQL InnoDB 在可重复读隔离级别下，普通 SELECT 不加锁，依靠什么保证一致性读？",
          options: ["间隙锁", "MVCC 多版本并发控制（undo log + Read View）", "表级锁", "串行执行"],
          answer: [1],
          explain: "MVCC 通过版本链与 Read View 实现快照读，读写互不阻塞，大幅提升并发度；写操作才使用记录锁/间隙锁/临键锁。" },
        { id: "d04c03q4", type: "multi", level: 3, tags: ["优化"],
          stem: "下列哪些写法会导致索引失效？",
          options: ["WHERE DATE(created_at)='2026-01-01'", "WHERE name LIKE '%abc'", "WHERE id+1=100", "WHERE status=1 AND user_id=5（联合索引为 user_id,status）"],
          answer: [0, 1, 2],
          explain: "对索引列使用函数、前导通配符 LIKE、表达式运算都会使索引失效。D 中虽然顺序反了，但最左列 user_id 等值匹配仍可用索引，只是可能无法用到 status 排序优化。" }
      ]
    },
    {
      id: "d04c04", name: "事务、并发与分布式", points: ["ACID", "隔离级别与异常", "CAP/BASE", "分布式事务", "复制与一致性"],
      questions: [
        { id: "d04c04q1", type: "single", level: 2, tags: ["隔离级别"],
          stem: "「幻读」在哪个隔离级别下被标准定义消除？",
          options: ["读未提交", "读已提交", "可重复读", "串行化"],
          answer: [3],
          explain: "SQL 标准中只有串行化完全消除幻读。MySQL InnoDB 的可重复读通过临键锁（Next-Key Lock）在很大程度上避免了幻读，属于实现层面的加强，但并非标准保证。" },
        { id: "d04c04q2", type: "single", level: 3, tags: ["CAP"],
          stem: "在发生网络分区（P）时，CAP 理论要求：",
          options: ["同时保证 C 和 A", "必须在 C 与 A 之间取舍", "放弃 P", "三者都能保证"],
          answer: [1],
          explain: "分布式系统 P 是客观存在，因此真正的选择是在分区期间偏向一致性（CP，如 ZooKeeper、etcd）还是可用性（AP，如 Cassandra、Eureka），BASE 是 AP 的实践原则。" },
        { id: "d04c04q3", type: "multi", level: 3, tags: ["分布式事务"],
          stem: "关于分布式事务方案，正确的有：",
          options: ["2PC 存在协调者单点与阻塞问题", "TCC 通过 Try-Confirm-Cancel 补偿，业务侵入较大", "本地消息表 + 定时补偿可实现最终一致", "Saga 适合长事务，需为每个步骤定义补偿动作"],
          answer: [0, 1, 2, 3],
          explain: "四项均正确。工程选型建议：强一致短事务用 2PC/3PC；跨服务长流程用 Saga/TCC；对一致性要求不极端的场景优先本地消息表或事务消息，实现简单、可观测性好。" },
        { id: "d04c04q4", type: "essay", level: 3, tags: ["一致性", "综合"],
          stem: "电商下单需要「扣库存 + 创建订单 + 扣余额」跨三个服务，请给出你的分布式一致性方案与异常处理。",
          answer: "首选方案：本地消息表 / 事务消息（最终一致）。下单服务在本地事务中同时写入订单和「消息表」，事务提交后由定时任务或消息队列投递「扣库存」「扣余额」消息；下游幂等消费并回调确认，失败则重试并进入死信队列人工干预。库存与余额操作必须支持幂等（唯一业务键 + 状态机），并预留冻结额度避免超卖（Redis 预扣 + Lua 原子脚本，或数据库行锁/乐观锁 version 字段）。异常处理：①下游失败重试（指数退避 + 上限后告警）；②订单超时未支付自动关单并回补库存（延迟队列）；③对账任务每日比对三方数据并自动/人工补偿；④关键接口提供查询与人工补偿入口。若必须强一致，可用 TCC：Try 阶段冻结库存与余额，Confirm 提交，Cancel 释放；代价是业务改造量大、需处理空回滚与悬挂。设计上还应保证「业务唯一号」贯穿全链路，便于追踪与重放。",
          explain: "评分要点：①方案名称与原理（本地消息表/事务消息/TCC/Saga）；②幂等设计（唯一键、状态机）；③超卖与并发控制（预扣、乐观锁）；④失败重试与死信处理；⑤对账与人工补偿；⑥一致性与可用性的权衡说明。" }
      ]
    }
  ]
}
);
