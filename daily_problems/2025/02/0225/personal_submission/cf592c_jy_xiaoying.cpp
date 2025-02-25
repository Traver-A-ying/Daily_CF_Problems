class Solution {
public:
    string reorganizeString(string s) {
        int n = s.length();
        unordered_map<char, int> count;
        for (char ch : s) {
            count[ch]++;
        }

        vector<pair<char, int>> a(count.begin(), count.end());
        // 按出现次数从大到小排序
        ranges::sort(a, [](const auto& p, const auto& q) { return p.second > q.second; });
        int m = a[0].second;
        if (m > n - m + 1) {
            return "";
        }

        string ans(n, 0);
        int i = 0;
        for (auto [ch, cnt] : a) {
            while (cnt--) {
                ans[i] = ch;
                i += 2;
                if (i >= n) {
                    i = 1; // 从奇数下标开始填
                }
            }
        }
        return ans;
    }
};

作者：灵茶山艾府
链接：https://leetcode.cn/problems/reorganize-string/solutions/2779462/tan-xin-gou-zao-pai-xu-bu-pai-xu-liang-c-h9jg/
来源：力扣（LeetCode）
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
