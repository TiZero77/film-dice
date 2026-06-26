import type { Movie, MovieDetail, Genre, TMDBDiscoverResponse, TMDBGenreResponse, FilterState } from '../types/movie'
import { ERA_RANGES } from '../types/movie'

const BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

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

// 根据筛选条件发现电影（多页）
export async function discoverMovies(filters: FilterState, pages: number = 3): Promise<Movie[]> {
  const params: Record<string, string> = {
    'vote_count.gte': '100',         // 保证评分可信度
    'sort_by': 'vote_average.desc',
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

  // 并发请求多页
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1)
  const responses = await Promise.all(
    pageNumbers.map(page =>
      tmdbFetch<TMDBDiscoverResponse>('/discover/movie', { ...params, page: String(page) })
    )
  )

  return responses.flatMap(r => r.results)
}

// 获取电影详情
export async function fetchMovieDetail(movieId: number): Promise<MovieDetail> {
  return tmdbFetch<MovieDetail>(`/movie/${movieId}`)
}
