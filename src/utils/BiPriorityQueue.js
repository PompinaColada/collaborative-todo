export class BiPriorityQueue {
    constructor() {
        this.list = []
        this.i = 0
    }

    enqueue(item, priority) {
        if (typeof priority !== 'number') {
            throw new Error('priority must be a number')
        }
        this.list.push({
            item: item,
            priority: priority,
            idx: this.i
        })
        this.i += 1
    }

    _findIdx(mode) {
        let bestIndex = 0

        for (let j = 1; j < this.list.length; j++) {
            const a = this.list[j]
            const b = this.list[bestIndex]

            switch (mode) {
                case 'highest':
                    if (a.priority > b.priority) {
                        bestIndex = j
                    }
                    break

                case 'lowest':
                    if (a.priority < b.priority) {
                        bestIndex = j
                    }
                    break

                case 'oldest':
                    if (a.idx < b.idx) {
                        bestIndex = j
                    }
                    break

                case 'newest':
                    if (a.idx > b.idx) {
                        bestIndex = j
                    }
                    break
                default:
                    throw new Error(`Invalid mode "${mode}". Використовуйте 'highest', 'lowest', 'oldest' або 'newest'.`)
            }
        }

        return bestIndex
    }

    peek(mode) {
        if (this.list.length === 0) {
            return undefined
        }
        const bestIndex = this._findIdx(mode)
        return this.list[bestIndex].item
    }

    dequeue(mode) {
        if (this.list.length === 0) {
            return undefined
        }
        const bestIndex = this._findIdx(mode)
        const removedArr = this.list.splice(bestIndex, 1)
        return removedArr[0].item
    }

    size() {
        return this.list.length
    }

    isEmpty() {
        return this.list.length === 0
    }

    clear() {
        this.list = []
        this.i = 0
    }
}
