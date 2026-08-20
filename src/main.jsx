import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Compass, Heart, MessageCircle, UserRound, Settings2, RefreshCw, Send, X, Sparkles, ArrowLeft, SlidersHorizontal } from 'lucide-react'
import './styles.css'

const MATCHES = {
  男: [
    { id: '陈夜', age: 26, role: '设计师', mark: '夜行者', line: '“比起套路，我更喜欢有来有回。”', tags: ['慢热', '声控', '只聊真心话'] },
    { id: '周予安', age: 29, role: '调酒师', mark: '在线', line: '“今晚不想一个人醒着。”', tags: ['直球', '夜聊', '边界感'] },
    { id: '顾澜', age: 24, role: '研究生', mark: '刚刚上线', line: '“先交换一件只告诉陌生人的事？”', tags: ['暧昧', '文字控', '不催促'] },
  ],
  女: [
    { id: '林雾', age: 27, role: '自由撰稿人', mark: '夜行者', line: '“我对会好好说话的人没有抵抗力。”', tags: ['慢热', '深夜', '氛围感'] },
    { id: '沈知夏', age: 25, role: '摄影编辑', mark: '在线', line: '“聊天不必有目的，舒服就好。”', tags: ['温柔', '直球', '文字控'] },
    { id: '许遥', age: 30, role: '产品经理', mark: '刚刚上线', line: '“你会把哪句话留到凌晨才说？”', tags: ['成熟', '边界感', '暧昧'] },
  ],
  '不限': [
    { id: '陆迟', age: 28, role: '音乐人', mark: '在线', line: '“我们可以从一首歌开始认识。”', tags: ['声控', '夜聊', '慢热'] },
    { id: '程雾', age: 26, role: '编辑', mark: '夜行者', line: '“我喜欢知道你此刻在想什么。”', tags: ['文字控', '暧昧', '真诚'] },
    { id: '向晚', age: 29, role: '策展人', mark: '刚刚上线', line: '“给我一句不会发给熟人的开场白。”', tags: ['直球', '不设限', '边界感'] },
  ],
}

const readProfile = () => JSON.parse(localStorage.getItem('nocturne-profile') || '{"name":"","age":"","gender":"","orientation":"","xp":""}')

function App() {
  const [profile, setProfile] = useState(readProfile)
  const [tab, setTab] = useState('nearby')
  const [refresh, setRefresh] = useState(0)
  const [systemOpen, setSystemOpen] = useState(false)
  const [realm, setRealm] = useState('sim')
  const [activeChat, setActiveChat] = useState(null)
  const [setupOpen, setSetupOpen] = useState(() => !readProfile().orientation)
  useEffect(() => localStorage.setItem('nocturne-profile', JSON.stringify(profile)), [profile])
  const candidates = useMemo(() => {
    const source = MATCHES[profile.orientation || '不限']
    const shift = refresh % source.length
    return [...source.slice(shift), ...source.slice(0, shift)]
  }, [profile.orientation, refresh])
  if (setupOpen) return <Setup profile={profile} setProfile={setProfile} onDone={() => setSetupOpen(false)} />
  return <div className="phone-app">
    <header className="app-top"><div><span className="app-kicker">NOCTURNE / 18+</span><strong>{realm === 'sim' ? '聊骚模拟器' : '现实世界'}</strong></div><div className="top-actions"><button className="realm-button" onClick={() => { setRealm(realm === 'sim' ? 'real' : 'sim'); setActiveChat(null) }}>{realm === 'sim' ? '退出模拟器' : '返回模拟器'}</button><button className="top-icon" aria-label="系统设置" onClick={() => setSystemOpen(true)}><Settings2 size={18}/></button></div></header>
    <main>{activeChat ? <Chat person={activeChat} onBack={() => setActiveChat(null)} /> : realm === 'real' ? <RealityView profile={profile} /> : <><div className="sim-tabs">{[["nearby","附近"],["match","匹配"],["chat","聊天"],["me","个人"]].map(([id,label]) => <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>{label}</button>)}</div><Screen tab={tab} profile={profile} candidates={candidates} refresh={() => setRefresh(v => v + 1)} onChat={setActiveChat} onEdit={() => setSetupOpen(true)} /></>}</main>
    {!activeChat && realm === 'sim' && <nav className="bottom-nav">{[["nearby", "附近", Compass], ["search", "搜索", SlidersHorizontal], ["chat", "聊天", MessageCircle], ["me", "个人", UserRound]].map(([id, label, Icon]) => <button key={id} className={tab === id ? 'current' : ''} onClick={() => setTab(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>}
    {systemOpen && <System profile={profile} setProfile={setProfile} onClose={() => setSystemOpen(false)} />}
  </div>
}

function RealityView({ profile }) { const [view, setView] = useState('记事'); const [planner, setPlanner] = useState(false); const [keywords, setKeywords] = useState(''); const [span, setSpan] = useState('周'); const [step, setStep] = useState(1); const views = ['记事', '人际', '属性', '手机', '地图']; const story = keywords ? `围绕“${keywords}”，你在第 ${step} ${span}遇见新的转折。AI 将根据你的选择安排人物、地点与关系变化。` : '本周的剧情从旧港区开始：一次偶然的消息，让你重新考虑要把时间留给谁。'; return <section className="screen reality-view"><div className="reality-tabs">{views.map(v => <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>{v}</button>)}</div>{view === '记事' && <><div className="reality-heading-row"><div><span className="app-kicker">WEEK {step} / 2026.08.20</span><h2>AI 记事</h2><p className="reality-lede">现实身份：{profile.name} · {profile.age} 岁</p></div><button className="cream-button" onClick={() => setPlanner(true)}>规划生活</button></div><article className="reality-note"><strong>本周剧情</strong><h3>{keywords || '雨停之后，去见一个新朋友'}</h3><p>{story}</p><span>关系推进 +8 · 氛围值 72</span></article><button className="next-time" onClick={() => setStep(step + 1)}>进入下一{span} <ArrowLeft size={14} className="turn-icon"/></button></>}{view === '人际' && <><span className="app-kicker">RELATIONS</span><h2>人际关系</h2>{['NOVA-1024 · 暧昧对象','MICA-7781 · 朋友','林澈 · 旧识'].map(x => <div className="reality-row" key={x}><strong>{x}</strong><span>关系值 42</span></div>)}</>}{view === '属性' && <><span className="app-kicker">REAL IDENTITY</span><h2>个人属性</h2><div className="reality-note"><div className="reality-row"><strong>姓名</strong><span>{profile.name}</span></div><div className="reality-row"><strong>年龄</strong><span>{profile.age}</span></div><div className="reality-row"><strong>时间跨度</strong><span>日 / 周 / 月</span></div></div></>}{view === '手机' && <><span className="app-kicker">DEVICE / WECHAT</span><h2>手机</h2><div className="reality-note"><h3>微信</h3><div className="reality-row"><strong>NOVA-1024</strong><span>你今晚有空吗？</span></div><div className="reality-row"><strong>MICA-7781</strong><span>发来一条新消息</span></div></div></>}{view === '地图' && <><span className="app-kicker">WORLD MAP</span><h2>地图</h2><div className="reality-map"><span>你</span><b>旧港区</b><i>NOVA</i></div></>}{planner && <div className="planner"><div className="planner-card"><button className="top-icon planner-close" onClick={() => setPlanner(false)}><X size={17}/></button><span className="app-kicker">LIFE PLANNER</span><h2>下一段生活</h2><p>输入几个关键词，AI 会扩写成你的剧情。</p><textarea rows="4" value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="例如：周末旅行、认识新朋友、努力工作"/><div className="span-pick">{['日','周','月'].map(x => <button className={span === x ? 'active' : ''} onClick={() => setSpan(x)} key={x}>{x}</button>)}</div><button className="cream-button planner-save" onClick={() => setPlanner(false)}>进入下一{span}</button></div></div>}</section> }

function Setup({ profile, setProfile, onDone }) {
  const [draft, setDraft] = useState(profile)
  const ready = draft.name.trim() && draft.age && draft.gender && draft.orientation
  return <div className="phone-app setup"><div className="setup-content"><span className="app-kicker">NOCTURNE / 18+</span><h1>进入前，先定义你。</h1><p>仅向虚构的成年匹配对象展示基础设定。</p><div className="form-stack"><label>昵称<input autoFocus maxLength="12" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="例如：林昼"/></label><label>年龄<input type="number" min="18" max="99" value={draft.age} onChange={e => setDraft({ ...draft, age: e.target.value })} placeholder="仅限成年人"/></label><label>性别<select value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value })}><option value="">请选择</option><option>男</option><option>女</option><option>非二元</option></select></label><label>性取向<select value={draft.orientation} onChange={e => setDraft({ ...draft, orientation: e.target.value })}><option value="">请选择</option><option value="男">偏好男性</option><option value="女">偏好女性</option><option value="不限">不限性别</option></select></label><label>你的偏好 / XP<textarea value={draft.xp} onChange={e => setDraft({ ...draft, xp: e.target.value })} placeholder="例如：慢热、文字暧昧、尊重边界" rows="3"/></label></div><button className="lime-button" disabled={!ready || Number(draft.age) < 18} onClick={() => { setProfile(draft); onDone() }}>开始匹配 <Sparkles size={16}/></button></div></div>
}

function Screen({ tab, profile, candidates, refresh, onChat, onEdit }) {
  const [query, setQuery] = useState('')
  const visible = candidates.filter(p => `${p.id} ${p.role} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  if (tab === 'search') return <SearchPage candidates={candidates} onChat={onChat} />
  if (tab === 'nearby' || tab === 'match') return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">FOR YOU</span><h2>{tab === 'nearby' ? '附近的心跳' : '为你匹配'}</h2><p>偏好 {profile.orientation === '不限' ? '不限性别' : `${profile.orientation}性`} · 基于你的设定</p></div><button className="refresh" onClick={refresh}><RefreshCw size={16}/></button></div><div className="signal"><i/>匹配信号稳定 <span>{visible.length} 位在线</span></div><div className="match-list">{visible.map((p, index) => <MatchCard key={p.id} person={p} distance={`${index * 2 + 1} km`} onChat={() => onChat(p)} />)}{!visible.length && <p className="no-results">没有找到匹配对象，换个关键词试试。</p>}</div></section>
  if (tab === 'chat') return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">INBOX</span><h2>聊天</h2></div></div><div className="inbox">{candidates.slice(0, 2).map((p, i) => <button className="inbox-row" key={p.id} onClick={() => onChat(p)}><Avatar name={p.id}/><div><strong>{p.id}</strong><p>{i ? '分享了一个新的话题' : '在等你的开场白'}</p></div><span>{i ? '21:08' : '刚刚'}</span></button>)}</div></section>
  return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">YOUR PROFILE</span><h2>个人</h2></div><button className="refresh" onClick={onEdit}><SlidersHorizontal size={16}/></button></div><div className="self-card"><Avatar name={profile.name}/><strong>{profile.name}</strong><p>{profile.age} 岁 · {profile.gender}</p><div className="preference"><span>性取向</span><b>{profile.orientation === '不限' ? '不限性别' : `偏好${profile.orientation}性`}</b></div><div className="preference"><span>偏好 / XP</span><b>{profile.xp || '尚未填写'}</b></div></div></section>
}

function SearchPage({ candidates, onChat }) { const [query, setQuery] = useState(''); const list = candidates.filter(p => `${p.id} ${p.role} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())); return <section className="screen"><span className="app-kicker">DISCOVER</span><h2>搜索</h2><div className="search-box"><Compass size={15}/><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="输入名字、职业或 XP 标签"/></div><div className="search-results">{list.map(p => <button className="search-result" key={p.id} onClick={() => onChat(p)}><Avatar name={p.id}/><div><strong>{p.id} · {p.age}</strong><p>{p.role} · {p.tags.join(' · ')}</p></div><span>查看</span></button>)}</div></section> }

function MatchCard({ person, distance, onChat }) { return <article className="match-card"><div className="card-top"><Avatar name={person.id}/><div><strong>{person.id} <em>{person.age}</em></strong><p>{person.role} · {distance}</p></div><span className="status"><i/>{person.mark}</span></div><blockquote>{person.line}</blockquote><div className="tag-row">{person.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="card-actions"><button className="quiet-button">略过</button><button className="lime-button" onClick={onChat}>开始聊天 <Send size={14}/></button></div></article> }
function Avatar({ name }) { return <div className="avatar" aria-hidden="true">{name.slice(0, 1)}</div> }

function Chat({ person, onBack }) { const [message, setMessage] = useState(''); const [lines, setLines] = useState([{ from: 'them', text: person.line.replace(/[“”]/g, '') }]); const send = () => { if (!message.trim()) return; setLines([...lines, { from: 'me', text: message.trim() }]); setMessage('') }; return <section className="chat-screen"><header className="chat-head"><button className="top-icon" onClick={onBack}><ArrowLeft size={19}/></button><div><strong>{person.id}</strong><span>在线 · {person.role}</span></div><Avatar name={person.id}/></header><div className="chat-stream"><p className="time">今天 21:06</p>{lines.map((line, i) => <div className={`bubble ${line.from}`} key={i}>{line.text}</div>)}</div><form className="composer" onSubmit={e => { e.preventDefault(); send() }}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="说点让对方想回复的话..."/><button type="submit" aria-label="发送"><Send size={17}/></button></form></section> }

function System({ profile, setProfile, onClose }) { const saved = JSON.parse(localStorage.getItem('nocturne-api') || '{}'); const [world, setWorld] = useState(() => localStorage.getItem('nocturne-world') || '成年人之间的虚构社交与关系模拟。'); const [xp, setXp] = useState(profile.xp || ''); const [api, setApi] = useState(saved.api || ''); const [key, setKey] = useState(saved.key || ''); const [model, setModel] = useState(saved.model || 'gpt-4o-mini'); const [models, setModels] = useState(saved.models || ['gpt-4o-mini','gpt-4o','自定义模型']); const [status, setStatus] = useState(''); const pullModels = () => { setModels(['gpt-4o-mini','gpt-4o','gpt-4.1-mini','自定义模型']); setStatus('模型列表已更新'); }; return <div className="system-layer"><div className="system-sheet"><div className="sheet-head"><div><span className="app-kicker">GLOBAL / API</span><h2>系统设定</h2></div><button className="top-icon" onClick={onClose}><X size={18}/></button></div><label>API Endpoint<input value={api} onChange={e => setApi(e.target.value)} placeholder="https://api.openai.com/v1" /></label><label>API Key<input type="password" value={key} onChange={e => setKey(e.target.value)} placeholder="sk-...（仅保存在本机）" /></label><label>模型<select value={model} onChange={e => setModel(e.target.value)}>{models.map(x => <option key={x}>{x}</option>)}</select></label><div className="api-actions"><button className="cream-button" onClick={pullModels}>拉取模型</button><button className="plain-button" onClick={() => setStatus(api && key ? '连接配置已就绪' : '请填写 Endpoint 和 Key')}>测试连接</button></div><label>世界观<textarea rows="4" value={world} onChange={e => setWorld(e.target.value)} /></label><label>我的 XP / 偏好导入<textarea rows="4" value={xp} onChange={e => setXp(e.target.value)} placeholder="粘贴你的偏好、边界、聊天风格或关键词..." /></label><label>时间流速<select defaultValue="周"><option>日</option><option>周</option><option>月</option></select></label><button className="cream-button save-system" onClick={() => { localStorage.setItem('nocturne-world', world); localStorage.setItem('nocturne-api', JSON.stringify({ api, key, model, models })); setProfile({ ...profile, xp }); onClose() }}>保存设置</button>{status && <p className="api-status">{status}</p>}<p className="privacy-note">密钥仅保存在当前浏览器，不会上传到仓库。</p></div></div> }

createRoot(document.getElementById('root')).render(<App />)
