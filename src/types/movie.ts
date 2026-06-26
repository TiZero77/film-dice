// TMDB API 返回的电影基础信息
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  original_language: string
  runtime?: number
}

// TMDB 电影详情（含片长）
export interface MovieDetail {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genres: Genre[]
  runtime: number
  original_language: string
  tagline: string
}

// TMDB 类型
export interface Genre {
  id: number
  name: string
}

// 抽到的卡牌（带翻转状态）
export interface DrawnCard {
  movie: Movie
  isFlipped: boolean
  isSelected: boolean
}

// 筛选条件
export interface FilterState {
  genres: number[]          // 类型 ID 列表
  era: EraOption | null     // 年代
  minRating: number         // 最低评分
  maxRating: number         // 最高评分
  language: string          // 语言代码
  maxRuntime: number | null // 最大片长（分钟）
}

// 年代选项
export type EraOption = 'classic' | '90s' | '00s' | '10s' | 'recent'

// 年代对应的年份范围
export const ERA_RANGES: Record<EraOption, { gte: number; lte: number }> = {
  classic: { gte: 1900, lte: 1989 },
  '90s': { gte: 1990, lte: 1999 },
  '00s': { gte: 2000, lte: 2009 },
  '10s': { gte: 2010, lte: 2019 },
  recent: { gte: 2021, lte: new Date().getFullYear() },
}

// 语言选项
export const LANGUAGE_OPTIONS = [
  { value: '', label: '全部' },
  { value: 'en', label: '英语' },
  { value: 'ja', label: '日语' },
  { value: 'ko', label: '韩语' },
  { value: 'zh', label: '华语' },
  { value: 'fr', label: '法语' },
] as const

// 片长选项
export const RUNTIME_OPTIONS = [
  { value: null, label: '不限' },
  { value: 90, label: '90分钟内' },
  { value: 120, label: '2小时内' },
  { value: 180, label: '3小时内' },
] as const

// Supabase 表类型
export interface WatchlistItem {
  id: string
  user_id: string
  movie_id: number
  created_at: string
}

export interface WatchedItem {
  id: string
  user_id: string
  movie_id: number
  rating: number | null
  comment: string | null
  created_at: string
}

export interface DrawHistoryItem {
  id: string
  user_id: string
  movie_id: number
  drawn_at: string
}

// TMDB discover API 响应
export interface TMDBDiscoverResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

// TMDB genre list 响应
export interface TMDBGenreResponse {
  genres: Genre[]
}
