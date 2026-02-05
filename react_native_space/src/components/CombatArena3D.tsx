import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, TextureLoader } from 'expo-three';
import * as THREE from 'three';
import { Enemy } from '../types';

const { width, height } = Dimensions.get('window');

interface Props {
  enemies: Enemy[];
  playerHealth: number;
  onEnemyHit: (enemyId: string, damage: number) => void;
}

const CombatArena3D: React.FC<Props> = ({ enemies, playerHealth, onEnemyHit }) => {
  const [gl, setGL] = useState<any>(null);
  const requestRef = useRef<number>();
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<any>(null);
  const enemyMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const playerMeshRef = useRef<THREE.Mesh | null>(null);

  const onContextCreate = async (gl: any) => {
    setGL(gl);

    // Setup renderer
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.Fog(0x1a1a1a, 10, 50);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xd32f2f, 1, 100);
    pointLight.position.set(0, 5, 0);
    scene.add(pointLight);

    // Create arena floor
    const floorGeometry = new THREE.CircleGeometry(15, 32);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.8,
      metalness: 0.2,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create arena boundary
    const boundaryGeometry = new THREE.TorusGeometry(15, 0.3, 16, 100);
    const boundaryMaterial = new THREE.MeshStandardMaterial({
      color: 0xd32f2f,
      emissive: 0xd32f2f,
      emissiveIntensity: 0.5,
    });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    boundary.rotation.x = -Math.PI / 2;
    scene.add(boundary);

    // Create player (simple capsule)
    const playerGeometry = new THREE.CapsuleGeometry(0.5, 1, 8, 16);
    const playerMaterial = new THREE.MeshStandardMaterial({
      color: 0x4444ff,
      emissive: 0x2222ff,
      emissiveIntensity: 0.2,
    });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.position.set(0, 1, 0);
    playerMesh.castShadow = true;
    scene.add(playerMesh);
    playerMeshRef.current = playerMesh;

    // Animation loop
    const animate = () => {
      requestRef.current = requestAnimationFrame(animate);

      // Rotate boundary for effect
      if (boundary) {
        boundary.rotation.z += 0.005;
      }

      // Update enemies
      enemyMeshesRef.current.forEach((mesh, id) => {
        const enemy = enemies.find((e) => e.id === id);
        if (enemy && enemy.isAlive) {
          // Simple AI: move toward player
          const direction = new THREE.Vector3(0, 0, 0).sub(mesh.position).normalize();
          mesh.position.x += direction.x * 0.02;
          mesh.position.z += direction.z * 0.02;

          // Rotate to face player
          mesh.lookAt(0, mesh.position.y, 0);

          // Bob animation
          mesh.position.y = 1 + Math.sin(Date.now() * 0.003 + parseFloat(id)) * 0.2;
        } else if (mesh.parent) {
          scene.remove(mesh);
          enemyMeshesRef.current.delete(id);
        }
      });

      // Render
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    animate();
  };

  // Update enemies
  useEffect(() => {
    if (!sceneRef.current) return;

    enemies.forEach((enemy) => {
      if (!enemyMeshesRef.current.has(enemy.id) && enemy.isAlive) {
        // Create enemy mesh
        const enemyGeometry = new THREE.ConeGeometry(0.6, 1.5, 8);
        let color = 0xff4444;
        if (enemy.type === 'ELITE') color = 0xffaa00;
        if (enemy.type === 'BOSS') color = 0xff00ff;

        const enemyMaterial = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.3,
        });
        const enemyMesh = new THREE.Mesh(enemyGeometry, enemyMaterial);
        enemyMesh.position.set(enemy.position.x, enemy.position.y, enemy.position.z);
        enemyMesh.castShadow = true;
        sceneRef.current.add(enemyMesh);
        enemyMeshesRef.current.set(enemy.id, enemyMesh);
      }
    });
  }, [enemies]);

  useEffect(() => {
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <GLView style={styles.glView} onContextCreate={onContextCreate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glView: {
    flex: 1,
  },
});

export default CombatArena3D;
