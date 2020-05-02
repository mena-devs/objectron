const match = require('../index')
const assert = require('chai').assert
const suite = require('mocha').suite
const test = require('mocha').test

suite('Objectron Core Tests', () => {
  test('Match with pattern keys none-existant', () => {
    const payload = {
      type: 'message',
      text: 'text'
    }

    const result = match(payload, {
      other: 'stuff',
      text: 'text'
    })

    const expected = {
      match: false,
      total: 1,
      matches: {
        text: 'text'
      },
      groups: {}
    }

    assert.isFalse(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match with function', () => {
    const payload = {
      type: 'message',
      text: 'text',
      int: 1,
      bool: true,
      float: 1.1,
      items: [1, 1, 1, 1]
    }

    const result = match(payload, {
      type: (val) => val === 'message',
      text: (val) => val.length == 4,
      int: (val) => val + 1 == 2,
      bool: (val) => !!val, // STAHP!
      float: (val) => val - 1.1 == 0,
      items: (val) => val.length == 4
    })

    const expected = {
      match: true,
      total: 6,
      matches: {
        type: 'message',
        text: 'text',
        int: 1,
        bool: true,
        float: 1.1,
        items: [1, 1, 1, 1]
      },
      groups: {}
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match with primitive types', () => {
    const payload = {
      type: 'message',
      text: 'text',
      int: 1,
      bool: true,
      float: 1.1
    }

    const result = match(payload, {
      type: 'message',
      text: 'text',
      int: 1,
      bool: true,
      float: 1.1
    })

    const expected = {
      match: true,
      total: 5,
      matches: {
        type: 'message',
        text: 'text',
        int: 1,
        bool: true,
        float: 1.1
      },
      groups: {}
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match depth 1 regular expressions', () => {
    const payload = {
      type: 'message',
      text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
    }

    const result = match(payload, {
      type: 'message',
      text: /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/
    })

    const expected = {
      match: true,
      total: 2,
      matches: {
        type: 'message',
        text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
      },
      groups: {
        name: 'Smith',
        email: 'john@example.com',
        company: 'CompanyX',
        role: 'Engineer'
      }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match nested object and depth 1 regular expression', () => {
    const payload = {
      type: 'message',
      text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)',
      first_block: {
        number: 1,
        bool: true,
        second_block: {
          number: 1,
          bool: true,
          string: 'foo bar'
        }
      }
    }

    const result = match(payload, {
      type: 'message',
      text: /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
      first_block: {
        number: 1,
        bool: true,
        second_block: {
          number: 1,
          bool: true,
          string: /foo (?<who>.*)/
        }
      }
    })

    const expected = {
      match: true,
      total: 7,
      matches: {
        type: 'message',
        text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)',
        first_block: {
          number: 1,
          bool: true,
          second_block: {
            number: 1,
            bool: true,
            string: 'foo bar'
          }
        }
      },
      groups: {
        name: 'Smith',
        email: 'john@example.com',
        company: 'CompanyX',
        role: 'Engineer',
        who: 'bar'
      }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match nested array', () => {
    const payload = {
      type: 'message',
      items: [0, 1, 2, 3]
    }

    const result = match(payload, {
      type: 'message',
      items: [3, 2, 1, 0]
    })

    const expected = {
      match: true,
      total: 5,
      matches: {
        type: 'message',
        items: [3, 2, 1, 0]
      },
      groups: {}
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match multi-type array', () => {
    const payload = {
      type: 'message',
      items: [true, 'foo', 2, 3]
    }

    const result = match(payload, {
      type: 'message',
      items: [true, 'foo', 2, 3]
    })

    const expected = {
      match: true,
      total: 5,
      matches: {
        type: 'message',
        items: [true, 'foo', 2, 3]
      },
      groups: {}
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match depth 2 regular expression', () => {
    const payload = {
      type: 'message',
      items: ['ping john', 'hi smith', 'lorem ipsum']
    }

    const result = match(payload, {
      type: 'message',
      items: [/ping (?<someone>\S+)/, /hi (?<another>\S+)/, /lorem ipsum/]
    })

    const expected = {
      match: true,
      total: 4,
      matches: {
        type: 'message',
        items: ['ping john', 'hi smith', 'lorem ipsum']
      },
      groups: {
        someone: 'john',
        another: 'smith'
      }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match depth 1 regular expression and depth 2 nested objects and arrays', () => {
    const payload = {
      type: 'message',
      text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)',
      blocks: [
        {
          number: 1,
          bool: true,
          items: ['ping john', 'hi smith', 'lorem ipsum']
        },
        {
          number: 1,
          bool: true,
          string: 'ping john'
        }
      ]
    }

    const result = match(payload, {
      type: 'message',
      text: /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/,
      blocks: [
        {
          number: 1,
          bool: true,
          items: [/ping (?<someone>\S+)/, /hi (?<another>\S+)/, /lorem ipsum/]
        }, {
          number: 1,
          bool: true,
          string: /ping (?<who>.*)/
        }
      ]
    })

    const expected = {
      match: true,
      total: 10,
      matches: {
        type: 'message',
        text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)',
        blocks: [
          {
            number: 1,
            bool: true,
            items: ['ping john', 'hi smith', 'lorem ipsum']
          }, {
            number: 1,
            bool: true,
            string: 'ping john'
          }
        ]
      },
      groups: {
        name: 'Smith',
        email: 'john@example.com',
        company: 'CompanyX',
        role: 'Engineer',
        someone: 'john',
        another: 'smith',
        who: 'john'
      }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Match depth 3 regular expressions', () => {
    const payload = {
      type: 'message',
      level1: [
        {
          level2: [
            {
              text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
            }
          ]
        },
        {
          text: 'secondary object'
        }
      ]
    }

    const result = match(payload, {
      type: 'message',
      level1: [
        {
          level2: [
            {
              text: /invite \((?<name>\S+)\) \((?<email>\S+)\) \((?<company>\S+)\) \((?<role>\S+)\)/
            }
          ]
        }
      ]
    })

    const expected = {
      match: true,
      total: 2,
      matches: {
        type: 'message',
        level1: [
          {
            level2: [
              {
                text: 'invite (Smith) (john@example.com) (CompanyX) (Engineer)'
              }
            ]
          }
        ]
      },
      groups: {
        name: 'Smith',
        email: 'john@example.com',
        company: 'CompanyX',
        role: 'Engineer'
      }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })

  test('Callback fired on match', () => {
    let called = false

    const payload = {
      type: 'message'
    }

    match(payload, {
      type: 'message'
    }, () => {
      return called = true
    })

    assert.isTrue(called)
  })

  test('Variation of all the tests above', () => {
    const payload = {
      api: 13,
      ids: [1, 5, 130, 23, 45, 12],
      components: {
        type: 'section',
        fields: [
          {
            type: 'plain_text',
            text: 'going home?'
          },
          {
            type: 'markdown',
            text: '*This must be it*'
          }
        ]
      }
    }

    const result = match(payload, {
      api: 13,
      ids: [130, 45, 12],
      components: {
        type: 'section',
        fields: [
          {
            type: 'plain_text',
            text: /(?<verb>\S+) (?<what>.+)?/
          }
        ]
      }
    })

    const expected = {
      match: true,
      total: 7,
      matches: {
        api: 13,
        ids: [130, 45, 12],
        components: {
          type: 'section',
          fields: [{ type: 'plain_text', text: 'going home?' }]
        }
      },
      groups: { verb: 'going', what: 'home?' }
    }

    assert.isTrue(result.match)
    assert.deepEqual(result, expected)
  })
})
