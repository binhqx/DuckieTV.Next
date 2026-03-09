<div class="leftpanel search-serie-overview">
    <button type="button" class="close" onclick="window.SidePanel.hide()" title="Close {{ $show['name'] }}">&times;</button>
    <table width="100%" border="0">
        <tbody>
            <tr>
                <td colspan="2">
                    <h3 style="text-align:center">{{ $show['name'] }}</h3>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <center>
                        <div class="poster large" style="background-image:url('{{ $show['poster'] ?? '' }}');background-size:contain;background-position:center center;background-repeat:no-repeat;margin-bottom:5px"></div>
                        <div style="color:rgb(208,208,208);font-size:13px;text-align:justify">
                            <p>{{ $show['overview'] ?: 'No overview available.' }}</p>
                        </div>
                    </center>
                    <div class="buttons" style="margin-bottom:16px;">
                        <a class="btn" href="{{ $show['trailer'] ?? 'https://www.youtube.com/results?search_query=' . urlencode($show['name']) . '+official+trailer' }}" target="_blank" rel="noreferrer">
                            <i class="glyphicon glyphicon-facetime-video"></i>
                            <strong>WATCH TRAILER</strong>
                        </a>
                        @if($isFavorite)
                            <a class="btn" href="javascript:void(0)" onclick="window.Toast && window.Toast.info('Already in favorites'); return false;">
                                <i class="glyphicon glyphicon-ok"></i>
                                <strong>ALREADY IN FAVORITES</strong>
                            </a>
                        @else
                            <a class="btn" href="javascript:void(0)" onclick="document.getElementById('search-add-favorite-form').submit()">
                                <i class="glyphicon glyphicon-plus"></i>
                                <strong>ADD TO FAVORITES</strong>
                            </a>
                            <form id="search-add-favorite-form" action="{{ route('search.add') }}" method="POST" style="display:none;">
                                @csrf
                                <input type="hidden" name="trakt_id" value="{{ $show['trakt_id'] }}">
                            </form>
                        @endif
                    </div>
                </td>
            </tr>
            <tr>
                <th>LINKS</th>
                <td>
                    <a style="text-decoration: underline" href="https://www.google.com/search?q={{ urlencode($show['name']) }} (TV series)+Wikipedia&btnI=745" target="_blank" rel="noreferrer">Wikipedia</a><strong> | </strong>
                    @if(!empty($show['imdb_id']))
                        <a style="text-decoration: underline" href="https://www.imdb.com/title/{{ $show['imdb_id'] }}" target="_blank" rel="noreferrer">IMDB</a><strong> | </strong>
                    @endif
                    @if(!empty($show['tmdb_id']))
                        <a style="text-decoration: underline" href="https://www.themoviedb.org/tv/{{ $show['tmdb_id'] }}" target="_blank" rel="noreferrer">TMDB</a><strong> | </strong>
                    @endif
                    @if(!empty($show['tvdb_id']))
                        <a style="text-decoration: underline" href="https://thetvdb.com/?tab=series&id={{ $show['tvdb_id'] }}" target="_blank" rel="noreferrer">TVDB</a><strong> | </strong>
                    @endif
                    @if(!empty($show['trakt_id']))
                        <a style="text-decoration: underline" href="https://www.trakt.tv/shows/{{ $show['trakt_id'] }}" target="_blank" rel="noreferrer">Trakt</a>
                    @endif
                </td>
            </tr>
            @if(!empty($show['translated_day']))
                <tr>
                    <th>AIRS ON</th>
                    <td>{{ $show['translated_day'] }} {{ $show['airs']['time'] ?? '' }} {{ $show['airs']['timezone'] ?? '' }}</td>
                </tr>
            @endif
            @if(!empty($show['first_aired']))
                <tr>
                    <th>FIRST AIRED</th>
                    <td>{{ \Illuminate\Support\Carbon::parse($show['first_aired'])->format('M j, Y') }}</td>
                </tr>
            @endif
            @if(!empty($show['translated_status']))
                <tr>
                    <th>STATUS</th>
                    <td>{{ $show['translated_status'] }}</td>
                </tr>
            @endif
            @if(!empty($show['translated_genres']))
                <tr>
                    <th>GENRE</th>
                    <td>
                        <ul class="list-unstyled">
                            @foreach($show['translated_genres'] as $genre)
                                <li>{{ $genre }}</li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
            @endif
            @if(!empty($show['certification']))
                <tr>
                    <th>CONTENT RATING</th>
                    <td>{{ $show['certification'] }}</td>
                </tr>
            @endif
            @if(!empty($show['country']))
                <tr>
                    <th>COUNTRY</th>
                    <td>{{ strtoupper($show['country']) }}</td>
                </tr>
            @endif
            @if(!empty($show['network']))
                <tr>
                    <th>NETWORK</th>
                    <td>{{ $show['network'] }}</td>
                </tr>
            @endif
            @if(!empty($show['rating']))
                <tr>
                    <th>RATING</th>
                    <td>{{ round($show['rating'] * 10) }}% ({{ number_format((int) ($show['votes'] ?? 0)) }} votes)</td>
                </tr>
            @endif
            @if(!empty($show['runtime']))
                <tr>
                    <th>RUN TIME</th>
                    <td>{{ $show['runtime'] }} minutes</td>
                </tr>
            @endif
            @if(!empty($show['actors']))
                <tr>
                    <th>ACTORS</th>
                    <td>
                        <ul class="list-unstyled">
                            @foreach($show['actors'] as $actor)
                                <li>{{ $actor }}</li>
                            @endforeach
                        </ul>
                    </td>
                </tr>
            @endif
        </tbody>
    </table>
</div>
<div class="rightpanel"></div>
