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
    <main>{activeChat ? <Chat person={activeChat} onBack={() => setActiveChat(null)} /> : realm === 'real' ? <RealityView profile={profile} /> : <Screen tab={tab} profile={profile} candidates={candidates} refresh={() => setRefresh(v => v + 1)} onChat={setActiveChat} onEdit={() => setSetupOpen(true)} />}</main>
    {!activeChat && realm === 'sim' && <nav className="bottom-nav">{[["nearby", "附近", Compass], ["match", "匹配", Heart], ["chat", "聊天", MessageCircle], ["me", "个人", UserRound]].map(([id, label, Icon]) => <button key={id} className={tab === id ? 'current' : ''} onClick={() => setTab(id)}><Icon size={18}/><span>{label}</span></button>)}</nav>}
    {systemOpen && <System profile={profile} setProfile={setProfile} onClose={() => setSystemOpen(false)} />}
  </div>
}

function RealityView({ profile }) { const [view, setView] = useState('记事'); const views = ['记事', '人际', '属性', '手机', '地图']; return <section className="screen reality-view"><div className="reality-tabs">{views.map(v => <button className={view === v ? 'active' : ''} onClick={() => setView(v)} key={v}>{v}</button>)}</div>{view === '记事' && <><span className="app-kicker">TODAY / 2026.08.20</span><h2>AI 记事</h2><p className="reality-lede">现实身份：{profile.name} · {profile.age} 岁</p><article className="reality-note"><strong>今晚的剧情</strong><h3>雨停之后，去见一个新朋友</h3><p>你在旧港区的唱片店门口遇见一位新朋友。关系从一句自然的问候开始，今晚适合把好奇带到现实。</p><span>关系推进 +8 · 氛围值 72</span></article></>}{view === '人际' && <><span className="app-kicker">RELATIONS</span><h2>人际关系</h2>{['NOVA-1024 · 暧昧对象','MICA-7781 · 朋友','林澈 · 旧识'].map(x => <div className="reality-row" key={x}><strong>{x}</strong><span>关系值 42</span></div>)}</>}{view === '属性' && <><span className="app-kicker">REAL IDENTITY</span><h2>个人属性</h2><div className="reality-note"><div className="reality-row"><strong>姓名</strong><span>{profile.name}</span></div><div className="reality-row"><strong>年龄</strong><span>{profile.age}</span></div><div className="reality-row"><strong>时间跨度</strong><span>日 / 周 / 月</span></div></div></>}{view === '手机' && <><span className="app-kicker">DEVICE / WECHAT</span><h2>手机</h2><div className="reality-note"><h3>微信</h3><div className="reality-row"><strong>NOVA-1024</strong><span>你今晚有空吗？</span></div><div className="reality-row"><strong>MICA-7781</strong><span>发来一条新消息</span></div></div></>}{view === '地图' && <><span className="app-kicker">WORLD MAP</span><h2>地图</h2><div className="reality-map"><span>你</span><b>旧港区</b><i>NOVA</i></div></>}</section> }

function Setup({ profile, setProfile, onDone }) {
  const [draft, setDraft] = useState(profile)
  const ready = draft.name.trim() && draft.age && draft.gender && draft.orientation
  return <div className="phone-app setup"><div className="setup-content"><span className="app-kicker">NOCTURNE / 18+</span><h1>进入前，先定义你。</h1><p>仅向虚构的成年匹配对象展示基础设定。</p><div className="form-stack"><label>昵称<input autoFocus maxLength="12" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="例如：林昼"/></label><label>年龄<input type="number" min="18" max="99" value={draft.age} onChange={e => setDraft({ ...draft, age: e.target.value })} placeholder="仅限成年人"/></label><label>性别<select value={draft.gender} onChange={e => setDraft({ ...draft, gender: e.target.value })}><option value="">请选择</option><option>男</option><option>女</option><option>非二元</option></select></label><label>性取向<select value={draft.orientation} onChange={e => setDraft({ ...draft, orientation: e.target.value })}><option value="">请选择</option><option value="男">偏好男性</option><option value="女">偏好女性</option><option value="不限">不限性别</option></select></label><label>你的偏好 / XP<textarea value={draft.xp} onChange={e => setDraft({ ...draft, xp: e.target.value })} placeholder="例如：慢热、文字暧昧、尊重边界" rows="3"/></label></div><button className="lime-button" disabled={!ready || Number(draft.age) < 18} onClick={() => { setProfile(draft); onDone() }}>开始匹配 <Sparkles size={16}/></button></div></div>
}

function Screen({ tab, profile, candidates, refresh, onChat, onEdit }) {
  const [query, setQuery] = useState('')
  const visible = candidates.filter(p => `${p.id} ${p.role} ${p.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  if (tab === 'nearby' || tab === 'match') return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">FOR YOU</span><h2>{tab === 'nearby' ? '附近的心跳' : '为你匹配'}</h2><p>偏好 {profile.orientation === '不限' ? '不限性别' : `${profile.orientation}性`} · 基于你的设定</p></div><button className="refresh" onClick={refresh}><RefreshCw size={16}/></button></div><div className="search-box"><Compass size={15}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索名字、职业或标签"/></div><div className="signal"><i/>匹配信号稳定 <span>{visible.length} 位在线</span></div><div className="match-list">{visible.map((p, index) => <MatchCard key={p.id} person={p} distance={`${index * 2 + 1} km`} onChat={() => onChat(p)} />)}{!visible.length && <p className="no-results">没有找到匹配对象，换个关键词试试。</p>}</div></section>
  if (tab === 'chat') return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">INBOX</span><h2>聊天</h2></div></div><div className="inbox">{candidates.slice(0, 2).map((p, i) => <button className="inbox-row" key={p.id} onClick={() => onChat(p)}><Avatar name={p.id}/><div><strong>{p.id}</strong><p>{i ? '分享了一个新的话题' : '在等你的开场白'}</p></div><span>{i ? '21:08' : '刚刚'}</span></button>)}</div></section>
  return <section className="screen"><div className="screen-heading"><div><span className="app-kicker">YOUR PROFILE</span><h2>个人</h2></div><button className="refresh" onClick={onEdit}><SlidersHorizontal size={16}/></button></div><div className="self-card"><Avatar name={profile.name}/><strong>{profile.name}</strong><p>{profile.age} 岁 · {profile.gender}</p><div className="preference"><span>性取向</span><b>{profile.orientation === '不限' ? '不限性别' : `偏好${profile.orientation}性`}</b></div><div className="preference"><span>偏好 / XP</span><b>{profile.xp || '尚未填写'}</b></div></div></section>
}

function MatchCard({ person, distance, onChat }) { return <article className="match-card"><div className="card-top"><Avatar name={person.id}/><div><strong>{person.id} <em>{person.age}</em></strong><p>{person.role} · {distance}</p></div><span className="status"><i/>{person.mark}</span></div><blockquote>{person.line}</blockquote><div className="tag-row">{person.tags.map(tag => <span key={tag}>{tag}</span>)}</div><div className="card-actions"><button className="quiet-button">略过</button><button className="lime-button" onClick={onChat}>开始聊天 <Send size={14}/></button></div></article> }
function Avatar({ name }) { return <div className="avatar" aria-hidden="true">{name.slice(0, 1)}</div> }

function Chat({ person, onBack }) { const [message, setMessage] = useState(''); const [lines, setLines] = useState([{ from: 'them', text: person.line.replace(/[“”]/g, '') }]); const send = () => { if (!message.trim()) return; setLines([...lines, { from: 'me', text: message.trim() }]); setMessage('') }; return <section className="chat-screen"><header className="chat-head"><button className="top-icon" onClick={onBack}><ArrowLeft size={19}/></button><div><strong>{person.id}</strong><span>在线 · {person.role}</span></div><Avatar name={person.id}/></header><div className="chat-stream"><p className="time">今天 21:06</p>{lines.map((line, i) => <div className={`bubble ${line.from}`} key={i}>{line.text}</div>)}</div><form className="composer" onSubmit={e => { e.preventDefault(); send() }}><input value={message} onChange={e => setMessage(e.target.value)} placeholder="说点让对方想回复的话..."/><button type="submit" aria-label="发送"><Send size={17}/></button></form></section> }

function System({ profile, setProfile, onClose }) { const [world, setWorld] = useState(() => localStorage.getItem('nocturne-world') || '成年人之间的虚构社交与关系模拟。'); const [xp, setXp] = useState(profile.xp || ''); return <div className="system-layer"><div className="system-sheet"><div className="sheet-head"><div><span className="app-kicker">GLOBAL</span><h2>系统设定</h2></div><button className="top-icon" onClick={onClose}><X size={18}/></button></div><label>世界观<textarea rows="5" value={world} onChange={e => setWorld(e.target.value)} /></label><label>我的 XP / 偏好导入<textarea rows="5" value={xp} onChange={e => setXp(e.target.value)} placeholder="粘贴你的偏好、边界、聊天风格或关键词..." /></label><label>AI API Endpoint<input placeholder="后续接入时填写" /></label><button className="lime-button" onClick={() => { localStorage.setItem('nocturne-world', world); setProfile({ ...profile, xp }); onClose() }}>保存设置</button><p className="privacy-note">当前为本地模拟模式。所有人物与聊天内容均为虚构。</p></div></div> }

createRoot(document.getElementById('root')).render(<App />)
