import type { Movie, MovieDetail, Genre, TMDBDiscoverResponse, TMDBGenreResponse, FilterState } from '../types/movie'
import { ERA_RANGES } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const MAX_PAGES = 25 // 最多拉 25 页 = 500 部电影

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'zh-CN')
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '') url.searchParams.set(key, value)
  })

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status}`)
  }
  return response.json()
}

// 获取所有类型
export async function fetchGenres(): Promise<Genre[]> {
  const data = await tmdbFetch<TMDBGenreResponse>('/genre/movie/list')
  return data.genres
}

// 根据筛选条件发现电影（自动拉取尽可能多的页，上限 500 部）
export async function discoverMovies(filters: FilterState): Promise<Movie[]> {
  const params: Record<string, string> = {
    'vote_count.gte': '1000',        // 只要真正热门的电影
    'sort_by': 'popularity.desc',    // 热度优先
    'vote_average.gte': String(filters.minRating),
    'vote_average.lte': String(filters.maxRating),
  }

  if (filters.genres.length > 0) {
    params['with_genres'] = filters.genres.join(',')
  }

  if (filters.era) {
    const range = ERA_RANGES[filters.era]
    params['primary_release_date.gte'] = `${range.gte}-01-01`
    params['primary_release_date.lte'] = `${range.lte}-12-31`
  }

  if (filters.language) {
    params['with_original_language'] = filters.language
  }

  if (filters.maxRuntime) {
    params['with_runtime.lte'] = String(filters.maxRuntime)
  }

  // 第一页：获取总数
  const firstPage = await tmdbFetch<TMDBDiscoverResponse>('/discover/movie', { ...params, page: '1' })
  const totalPages = Math.min(firstPage.total_pages, MAX_PAGES)

  if (totalPages <= 1) {
    return firstPage.results
  }

  // 剩余页并发请求
  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2)
  const responses = await Promise.all(
    remainingPages.map(page =>
      tmdbFetch<TMDBDiscoverResponse>('/discover/movie', { ...params, page: String(page) })
    )
  )

  return [...firstPage.results, ...responses.flatMap(r => r.results)]
}

// 获取电影详情
export async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`)
}
