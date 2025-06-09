// Simple testing framework - you can replace with Jest, Mocha, etc.
function assert(condition, message) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(`${message}\nExpected: ${expected}\nActual: ${actual}`);
  }
}

// Import the functions we need to test
const { plugboardSwap, Rotor, ROTORS } = require('./enigma.js');

// Test Suite for plugboardSwap function
function testPlugboardSwap() {
  console.log('Testing plugboardSwap function...');
  
  // Test 1: No plugboard pairs - should return same character
  assertEquals(
    plugboardSwap('A', []),
    'A',
    'No pairs: A should return A'
  );
  
  // Test 2: Single pair - forward swap
  assertEquals(
    plugboardSwap('A', [['A', 'B']]),
    'B',
    'Single pair: A should swap to B'
  );
  
  // Test 3: Single pair - reverse swap
  assertEquals(
    plugboardSwap('B', [['A', 'B']]),
    'A',
    'Single pair: B should swap to A'
  );
  
  // Test 4: Character not in any pair
  assertEquals(
    plugboardSwap('C', [['A', 'B']]),
    'C',
    'No match: C should return C'
  );
  
  // Test 5: Multiple pairs
  const multiplePairs = [['A', 'B'], ['C', 'D'], ['E', 'F']];
  assertEquals(
    plugboardSwap('A', multiplePairs),
    'B',
    'Multiple pairs: A should swap to B'
  );
  assertEquals(
    plugboardSwap('D', multiplePairs),
    'C',
    'Multiple pairs: D should swap to C'
  );
  assertEquals(
    plugboardSwap('G', multiplePairs),
    'G',
    'Multiple pairs: G should return G (no match)'
  );
  
  // Test 6: Bidirectional property
  const pairs = [['X', 'Y'], ['M', 'N']];
  assertEquals(
    plugboardSwap(plugboardSwap('X', pairs), pairs),
    'X',
    'Bidirectional: double swap should return original'
  );
  
  console.log('✓ All plugboardSwap tests passed!');
}

// Test Suite for Rotor forward/backward methods
function testRotorMethods() {
  console.log('Testing Rotor forward/backward methods...');
  
  // Create test rotor (Rotor I)
  const testRotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
  
  // Test 1: Basic forward transformation
  const forwardResult = testRotor.forward('A');
  assert(
    forwardResult !== 'A',
    'Forward: A should be transformed to different letter'
  );
  assert(
    forwardResult.length === 1 && /[A-Z]/.test(forwardResult),
    'Forward: Result should be single uppercase letter'
  );
  
  // Test 2: Basic backward transformation
  const backwardResult = testRotor.backward(forwardResult);
  assertEquals(
    backwardResult,
    'A',
    'Backward: Should reverse the forward transformation'
  );
  
  // Test 3: Forward-backward reciprocity for all letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < alphabet.length; i++) {
    const letter = alphabet[i];
    const forward = testRotor.forward(letter);
    const backward = testRotor.backward(forward);
    assertEquals(
      backward,
      letter,
      `Reciprocity test failed for letter ${letter}`
    );
  }
  
  // Test 4: Different rotor positions
  const rotorAtPos5 = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 5);
  const resultPos0 = testRotor.forward('A');
  const resultPos5 = rotorAtPos5.forward('A');
  assert(
    resultPos0 !== resultPos5,
    'Different positions should give different results'
  );
  
  // Test 5: Ring settings effect
  const rotorRing0 = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 0);
  const rotorRing3 = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 3, 0);
  const resultRing0 = rotorRing0.forward('A');
  const resultRing3 = rotorRing3.forward('A');
  assert(
    resultRing0 !== resultRing3,
    'Different ring settings should give different results'
  );
  
  // Test 6: Position wrapping (test modular arithmetic)
  const rotorWrap = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 25);
  rotorWrap.step(); // Should wrap to position 0
  assertEquals(
    rotorWrap.position,
    0,
    'Position should wrap from 25 to 0'
  );
  
  // Test 7: Notch detection
  const rotorI = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, 0, 16); // Q is at position 16
  assert(
    rotorI.atNotch(),
    'Rotor I should be at notch when position shows Q'
  );
  
  // Test 8: All rotors should maintain reciprocity
  for (let rotorIdx = 0; rotorIdx < ROTORS.length; rotorIdx++) {
    const rotor = new Rotor(ROTORS[rotorIdx].wiring, ROTORS[rotorIdx].notch, 0, 0);
    for (let pos = 0; pos < 26; pos++) {
      rotor.position = pos;
      for (let ring = 0; ring < 26; ring++) {
        rotor.ringSetting = ring;
        const forward = rotor.forward('A');
        const backward = rotor.backward(forward);
        assertEquals(
          backward,
          'A',
          `Reciprocity failed for Rotor ${rotorIdx + 1}, pos ${pos}, ring ${ring}`
        );
      }
    }
  }
  
  console.log('✓ All Rotor method tests passed!');
}

// Test Suite for edge cases and error conditions
function testEdgeCases() {
  console.log('Testing edge cases...');
  
  // Test plugboard with invalid input
  assertEquals(
    plugboardSwap('a', [['A', 'B']]),
    'a',
    'Lowercase input should return unchanged'
  );
  
  // Test rotor with invalid position/ring settings
  const rotor = new Rotor(ROTORS[0].wiring, ROTORS[0].notch, -5, -10);
  const result = rotor.forward('A');
  assert(
    result.length === 1 && /[A-Z]/.test(result),
    'Negative position/ring should still work due to mod function'
  );
  
  console.log('✓ All edge case tests passed!');
}

// Run all tests
function runAllTests() {
  try {
    testPlugboardSwap();
    testRotorMethods();
    testEdgeCases();
    console.log('\n🎉 All tests passed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Export for external testing frameworks
module.exports = {
  testPlugboardSwap,
  testRotorMethods,
  testEdgeCases,
  runAllTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests();
} 