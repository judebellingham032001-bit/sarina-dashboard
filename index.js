<tbody>
    <% kasAll.forEach((t, index) => { %>
        <tr class="data-row" data-index="<%= index %>" data-total="<%= kasAll.length %>" style="font-size: 0.85rem;">
            <td class="nowrap text-muted tgl-format"><%= t.tgl %></td>
            <td>
                <div class="fw-bold text-uppercase"><%= t.kat %></div>
                <div class="small text-muted" style="font-size: 11px;"><%= t.ket %></div>
            </td>
            <td class="text-end nowrap">
                <div class="fw-bold <%= t.debet && t.debet != '0' && t.debet != '-' ? 'text-danger' : 'text-success' %>" style="font-size: 0.9rem;">
                    <%= (t.debet && t.debet != '0' && t.debet != '-') ? '-' + t.debet : (t.kredit && t.kredit != '0' && t.kredit != '-' ? '+' + t.kredit : '0') %>
                </div>
                <div class="text-muted" style="font-size: 10px; margin-top: -2px;">
                    Sisa: <%= t.saldo %>
                </div>
            </td>
            <td class="text-center">
                <% if(t.bukti && t.bukti.toLowerCase().includes('http')) { %>
                    <a href="<%= t.bukti %>" target="_blank" class="btn btn-sm btn-outline-primary py-0 px-2" style="font-size: 10px; border-radius: 8px;">BUKTI</a>
                <% } else { %> - <% } %>
            </td>
        </tr>
    <% }) %>
</tbody>
