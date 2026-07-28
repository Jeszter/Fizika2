const read = (key, fallback) => {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent('fyzika:storage', { detail: { key } }))
}

export const storage = {
  getResults: () => read('testResults', []),
  setResults: (results) => write('testResults', results.slice(-500)),
  getTeacherTests: () => read('teacherTests', {}),
  setTeacherTests: (tests) => write('teacherTests', tests),
  getStudents: () => read('teacherStudents', []),
  setStudents: (students) => write('teacherStudents', students),
  getAssignments: () => read('teacherAssignments', []),
  setAssignments: (assignments) => write('teacherAssignments', assignments),
  getSettings: () => read('teacherSettings', { passScore: 51, testMinutes: 15, schoolName: 'Fyzika II' }),
  setSettings: (settings) => write('teacherSettings', settings),
}

export const downloadJson = (filename, data) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const resultTopicId = (result) => result.topicId || result.topic?.replaceAll(' ', '-')

