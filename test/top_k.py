class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        
        
        dict = {}
        for num in nums:
            if num in dict:
                dict[num] += 1
            else:
                dict[num] = 1

        bucket = [[] for _ in range(len(nums)+1)]
        for key, val in dict.items():

            bucket[val].append(key)
        

        ret = []
        for row in reversed(bucket):

            if not row:
                continue
            else:
                for i in range(len(row)):

                    ret.append(row[i])
                    
                    if len(ret) == k:
                        return ret
