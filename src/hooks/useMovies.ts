import { useQuery } from '@tanstack/react-query'
import { fetchGenres, discoverMovies, fetchMovieDetail } from '../api/tmdb'
import type { FilterState } from '../types/movie'

// 获取类型列表（缓存1小时）
export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 60 * 60 * 1000,
  })
}

// 根据筛选条件获取电影池
export function useDiscoverMovies(filters: FilterState) {
  return useQuery({
    queryKey: ['movies', filters],
    queryFn: () => discoverMovies(filters),
    staleTime: 5 * 60 * 1000,
  })
}

// 获取单部电影详情
export function useMovieDetail(movieId: number | null) {
  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => fetchMovieDetail(movieId!),
    enabled: movieId !== null,
    staleTime: 30 * 60 * 1000,
  })
}
